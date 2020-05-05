'use strict'
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const BaseController = require('./base')
const hash = 'dsadasdwqdasdsdasdada'
const createRule = {
  email: { type: 'email' },
  nickName: { type: 'string' },
  pwd: { type: 'string' },
  captcha: { type: 'string' },
}


class UserController extends BaseController {
  async login() {
    const { ctx, app } = this
    const { pwd, captcha, email } = ctx.request.body
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }
    const user = ctx.model.User.findOne({
      email,
      pwd: md5(pwd + hash),
    })
    if (!user) {
      return this.error('邮箱密码错误')
    }
    const token = jwt.sign({
      _id: user._id,
      email,
    }, app.config.jwt.secret, {
      expiresIn: '1h',
    })
    this.success({ token })
  }
  async reg() {
    const { ctx } = this
    try {
      ctx.validate(createRule)
    } catch (e) {
      console.log(e)
      return this.error('参数校验失败', -1, e.error)
    }
    const { nickName, pwd, captcha, email } = ctx.request.body
    if (captcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {
      if (await this.checkEmail(email)) {
        this.error('邮箱已存在')
      } else {
        const res = await ctx.model.User.create({
          email,
          pwd: md5(pwd + hash),
          nickName,
        })
        if (res._id) {
          this.message('注册成功')
        }
      }
    } else {
      this.error('验证码错误')
    }
    // console.log(nickName, pwd, captcha, email)
    // this.success({ name: 'admin' })
  }
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email })
    return user
  }
  async verify() {

  }
  async info() {

  }
}
module.exports = UserController
