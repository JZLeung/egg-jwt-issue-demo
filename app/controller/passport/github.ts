import { Controller } from 'egg';

// interface Configs {
//     appId: string;
//     secret: string;
// }

export default class GithubController extends Controller {
    public async index() {
        const { config } = this;
        const { redirect } = this.ctx.query;
        // ctx.body = await ctx.service.test.sayHi('egg');
        // this.ctx.body = `${config.passport.github.client_id} - ${config.passport.github.client_secret}`;
        const state = `${+new Date()}${(Math.random() * 10000)}`;
        this.ctx.cookies.set('github_auth_redirect', `${state}|${redirect}`, {
            maxAge: 60 * 1000,
            // path: '/',
            httpOnly: true,
        });

        const {auth_url, client_id} = config.passport.github;

        const url = `${auth_url}?client_id=${client_id}&scope=user&state=${state}`;
        this.ctx.redirect(url);
    }

    public async callback() {
        const cookie = this.ctx.cookies.get('github_auth_redirect');
        const [_state, url] = cookie.split('|');
        const {state, code} = this.ctx.query;
        if (state !== _state) {
            return this.ctx.redirect(url);
        }
        const { logger } = this.ctx;
        const { config } = this;
        const params = {
            code,
            client_id: config.passport.github.client_id,
            client_secret: config.passport.github.client_secret,
            state,
            host: this.ctx.host,
            // redirect_uri: this.ctx.helper.urlFor('github.callback'),
        };
        // this.ctx.body = params;
        logger.info(params);
        const { data } = await this.ctx.curl(config.passport.github.access_token_url, {
            // uri: ,
            method: 'POST',
            data: params,
            dataType: 'json',
        });
        // logger.info(res);
        // this.ctx.body = {
        //     params,
        //     res,
        // };
        const access_token = data.access_token;
        logger.info('get access_token', access_token);
        this.ctx.cookies.set('github_auth_redirect', '', {
            maxAge: -1,
            httpOnly: true,
        });
        const redirect = url + (url.indexOf('?') > -1 ? '&' : '?') + `access_token=${access_token}`;
        logger.info('will redirect to: ', redirect);
        this.ctx.redirect(redirect);
    }
}
