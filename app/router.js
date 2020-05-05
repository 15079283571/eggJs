'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app

  router.get('/', controller.home.index)

  router.get('/captcha', controller.utils.createSvg)
  router.group({ name: 'user', prefix: '/user' }, router => {
    const { info, reg, login, verify } = controller.user
    router.post('/reg', reg)
    router.post('/login', login)
    router.get('/info', info)
    router.get('/verify', verify)
  })
}
