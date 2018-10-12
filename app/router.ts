import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/', controller.home.index);

    // passport
    router.get('/passport/github', controller.passport.github.index);
    router.get('/passport/github/callback', controller.passport.github.callback);

    router.get('/passport/wechat', controller.passport.wechat.index);
    router.get('/passport/wechat/redirect', controller.passport.wechat.redirect);
    router.get('/passport/wechat/pc', controller.passport.wechat.pc);
    router.post('/passport/wechat/mp', controller.passport.wechat.miniprogram);

    // router.get('/.well-known/acme-challenge/:id', controller.home.index);
    // router.get('/passport/wechat/callback', controller.passport.wechat.callback);
};
