// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Home from '../../../app/controller/home';
import PassportGithub from '../../../app/controller/passport/github';
import PassportWechat from '../../../app/controller/passport/wechat';

declare module 'egg' {
  interface IController {
    home: Home;
    passport: {
      github: PassportGithub;
      wechat: PassportWechat;
    };
  }
}
