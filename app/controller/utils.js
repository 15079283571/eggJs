'use strict'

const BaseController = require('./base')
const captcha = require('svg-captcha')

class UtilsController extends BaseController {
  async createSvg() {
    const svg = captcha.create({
      size: 4,
      width: 100,
      height: 40,
      noise: 3,
      fontSize: 30,
    })
    this.ctx.session.captcha = svg.text
    this.ctx.response.type = 'image/svg+xml'
    console.log(svg.text)
    this.ctx.body = svg.data
  }
  async sendMailer() {
    const { ctx } = this
    const email = ctx.query.email
    const text = Math.random().toString().slice(2, 6)
    ctx.session.emailCode = text
    const subText = 'test'
    const html = `<h2>验证码：${text}</h2>`
    const res = await this.service.utils.email(email, subText, text, html)
    if (res) {
      this.success('发送成功')
    } else {
      this.error('发送失败')
    }
  }
}

module.exports = UtilsController
