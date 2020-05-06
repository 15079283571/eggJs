'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app

  router.get('/', controller.home.index)

  const jwt = app.middleware.jwt({ app })

  router.get('/captcha', controller.utils.createSvg)
  router.get('/sendEmail', controller.utils.sendMailer)

  router.post('/uploadFile', controller.utils.uploadFile)

  router.group({ name: 'user', prefix: '/user' }, router => {
    const { info, reg, login, verify } = controller.user
    router.post('/reg', reg)
    router.post('/login', login)
    router.get('/info', jwt, info)
    router.get('/verify', verify)
  })
}
