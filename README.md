# 百舌网-第三方登录程序

[百舌网](http://bbs.baishew.com/)，一个网络文学爱好者聚集地，最原创的评论，最精准的推书，专业的网络文学讨论社区。

## 先有的第三方登录

### GitHub

```env
GITHUB_CLIENT_ID=xxxx
GITHUB_CLIENT_SECRET=yyyy
```


### 微信小程序

```env
WECHAT_NAME_MP_APP_ID=xxx
WECHAT_NAME_MP_APP_SECRET=xxxx
```

### PC 扫码登录

```env
WECHAT_NAME_PC_APP_ID=aaa
WECHAT_NAME_PC_APP_SECRET=aaa
```

### 配置文件

`config/config.default.ts`:

```ts
// ADD YOU WECHAT APP INTO THEN INTERFACE
export interface BizConfig {
    baseUrl: string;
    passport: {
        github: any;
        wechat: {
            app1: WeixinConfigs;
            app2: WeixinConfigs;
        }
    };
}

// DEFINED YOUR APP CONFIGS
const appWxConfig: WeixinConfigs = {
    pc_scan: {
        // DO NOT MODIFY - BEGIN
        access_token_url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
        user_info_url: 'https://api.weixin.qq.com/sns/userinfo',
        // DO NOT MODIFY - END
        // REPLACE YOUR OWN APPID AND APPSECRET
        app_id: process.env.WECHAT_XXX_PC_APP_ID || '',
        app_secret: process.env.WECHAT_XXX_PC_APP_SECRET || '',
    },
    mp: {
        // DO NOT MODIFY - BEGIN
        access_token_url: 'https://api.weixin.qq.com/sns/jscode2session',
        // DO NOT MODIFY - END
        // REPLACE YOUR OWN APPID AND APPSECRET
        app_id: process.env.WECHAT_XXX_MP_APP_ID || '',
        app_secret: process.env.WECHAT_XXX_MP_APP_SECRET || '',
    },
};

// INSERT INTO THE APP CONFIG
config.passport = {
    github: {
        auth_url: 'https://github.com/login/oauth/authorize',
        access_token_url: 'https://github.com/login/oauth/access_token',
        client_id: process.env.GITHUB_CLIENT_ID || '',
        client_secret: process.env.GITHUB_CLIENT_SECRET || '',
    },
    wechat: {
        app: appWxConfig,
    },
};
```

## Usage

#### 安装
```bash
$ git clone xxx
$ cd xxx
$ npm install
```

#### 开发
```bash
$npm run dev
```

#### 部署
```bash
$ npm run tsc
$ cp .env build
$ cp package.json build
$ cd build
$ npm i
$ npm run start
```
