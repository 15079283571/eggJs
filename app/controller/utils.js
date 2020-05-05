'use strict'

const Controller = require('egg').Controller
const captcha = require('svg-captcha')

class UtilsController extends Controller {
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
}

module.exports = UtilsController
