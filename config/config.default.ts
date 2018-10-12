import { EggAppConfig, PowerPartial } from 'egg';
import * as path from 'path';
// for config.{env}.ts
export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>;

// app special config scheme
export interface BizConfig {
    // sourceUrl: string;
    passportUrl: string;
    // jwt: {
    //     secret: string;
    // };
}

export default () => {

    require('dotenv').config();
    const config = {} as PowerPartial<EggAppConfig> & BizConfig;

    // app special config
    // config.sourceUrl = `https://github.com/eggjs/examples/tree/master/${appInfo.name}`;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = '__BAISHE.PASSPORT__';

    config.logger = {
        dir: path.resolve(__dirname, '../logs'),
    };

    // add your config here
    config.middleware = [];

    config.passportUrl = 'https://passport.baishew.com/';

    config.security = {
        csrf: false,
    };

    config.cluster = {
        listen: {
            port: process.env.EGG_PORT ? +process.env.EGG_PORT : 7001,
        },
    };

    config.jwt = {
        secret: 'oil_manager_for_leung',
        expiresIn: '1d',
        algorithm: 'HS512',
    };

    return config;
};
