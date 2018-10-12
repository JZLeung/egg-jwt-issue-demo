import * as crypto from 'crypto';
import { Controller } from 'egg';

const curlOpt = {dataType: 'json'};

class WXBizDataCrypt {
    appId: string;
    sessionKey: string;
    constructor(appId, sessionKey) {
        this.appId = appId;
        this.sessionKey = sessionKey;
    }

    decryptData(encryptedData, iv) {
        const sessionKey = Buffer.from(this.sessionKey, 'base64');
        const encryptedDatas = Buffer.from(encryptedData, 'base64');
        iv = Buffer.from(iv, 'base64');
        let decoded;
        try {
            // 解密
            const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
            // 设置自动 padding 为 true，删除填充补位
            decipher.setAutoPadding(true);
            decoded = decipher.update(encryptedDatas, 'binary', 'utf8');
            decoded += decipher.final('utf8');
            decoded = JSON.parse(decoded);
        } catch (err) {
            throw new Error('Illegal Buffer');
        }

        if (decoded.watermark.appid !== this.appId) {
            throw new Error('Illegal Buffer');
        }

        return decoded;
    }
}

export default class WechatController extends Controller {

    public async redirect() {
        const {code, state} = this.ctx.request.query;
        const redirect = decodeURIComponent(state);
        this.ctx.redirect(`${redirect}${redirect.indexOf('?') ? '&' : '?'}code=${code}`);
    }

    public async index() {
        const type = this.ctx.query.type || 'dsjt';
        const query = this.ctx.helper.formatSearchParams({
            appid: this.config.passport.wechat[type].pc_scan.app_id,
            redirect_uri: this.config.baseUrl + 'passport/wechat/pc?type=' + type,
            response_type: 'code',
            scope: 'snsapi_login',
        });
        this.ctx.body = (`https://open.weixin.qq.com/connect/qrconnect?${query}`);
    }

    public async pc() {
        // const {config} = this;
        const {helper, logger} = this.ctx;
        const code = this.ctx.query.code;
        const type = this.ctx.query.type;
        if (!type) {
            this.ctx.status = 500;
            this.ctx.body = {
                code: 500,
                errMsg: 'Error type.',
            };
            return false;
        }
        // const state = helper.randomStr();
        const config = this.config.passport.wechat[type].pc_scan;
        const params = {
            // redirect: encodeURIComponent(config.passport.wechat.redirect_uri),
            appid: config.app_id,
            secret: config.app_secret,
            grant_type: 'authorization_code',
            code,
            // state,
        };
        try {
            const url = `${config.access_token_url}?${helper.formatSearchParams(params)}`;
            const data = await this.ctx.curl(url, curlOpt);
            const {access_token, openid, errcode, errmsg} = data.data;
            logger.info(url, data.data);
            if (errcode) {
                throw new Error(errmsg);
            }
            const userInfoParams = {
                access_token,
                openid,
            };

            const userInfoUrl = `${config.user_info_url}?${helper.formatSearchParams(userInfoParams)}`;
            const userInfo = await this.ctx.curl(userInfoUrl, curlOpt);
            logger.info(userInfoUrl, userInfo.data);
            this.ctx.status = 200;
            this.ctx.body = {
                avatarUrl: userInfo.data.headimgurl,
                // city: userInfo.data.city,
                country: userInfo.data.country,
                gender: userInfo.data.sex,
                language: userInfo.data.language,
                nickName: userInfo.data.nickname,
                openId: userInfo.data.openid,
                province: userInfo.data.province,
                unionId: userInfo.data.unionid,
            };
        } catch (error) {
            logger.error(error);
            this.ctx.status = 500;
            this.ctx.body = error;
        }

    }

    public async miniprogram() {
        const {type = 'dsjt'} = this.ctx.query;
        const config = this.config.passport.wechat[type].mp;

        this.logger.info(config);
        const {code, iv, encryptedData} = this.ctx.request.body;
        const params = {
            // redirect: encodeURIComponent(config.passport.wechat.redirect_uri),
            appid: config.app_id,
            secret: config.app_secret,
            grant_type: 'authorization_code',
            js_code: code,
            // state,
        };
        try {
            const sessionUrl = `${config.access_token_url}?${this.ctx.helper.formatSearchParams(params)}`;
            const {data} = await this.ctx.curl(sessionUrl, curlOpt);
            this.ctx.logger.info(sessionUrl, data);
            // 2. 解密

            this.ctx.logger.info(encryptedData, data.session_key, iv);
            const pc = new WXBizDataCrypt(config.app_id, data.session_key);
            const {watermark, ...userInfo} = pc.decryptData(encryptedData, iv);
            this.ctx.logger.info(userInfo);
            this.ctx.status = 200;
            this.ctx.body = userInfo;
        } catch (error) {
            this.ctx.logger.error(error);
            this.ctx.status = 500;
            this.ctx.body = error;
        }
    }
}
