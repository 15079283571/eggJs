'use strict'
const jwt = require('jsonwebtoken')
module.exports = ({ app }) => {
  return async function verify(ctx, next) {
    if (!ctx.request.header.authorization) {
      ctx.body = {
        code: -2,
        message: '没有登录,去登录',
      }
      return
    }
    const token = ctx.request.header.authorization
    try {
      const res = jwt.verify(token, app.config.jwt.secret)
      ctx.state.email = res.email
      ctx.state.userId = res._id
      await next()
    } catch (err) {
      console.log(err)
      if (err.name === 'TokenExpiredError') {
        ctx.body = {
          code: -2,
          message: '身份过期',
        }
        return
      }
      ctx.body = {
        code: -1,
        message: '用户信息报错',
      }
    }
  }
}
