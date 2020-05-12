'use strict'

const BaseController = require('./base')
const captcha = require('svg-captcha')
const fse = require('fs-extra')
const path = require('path')
// const axios = require('axios')


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
  async mergeFile() {
    console.log(1111)
    const { size, ext, hash } = this.ctx.request.body
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)
    await this.service.utils.mergeFile(filePath, hash, size)
    this.success({
      url: `/public/${hash}.${ext}`,
    })
  }
  async uploadFile() {
    const { ctx } = this
    const file = ctx.request.files[0]
    const { name, hash } = ctx.request.body
    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash)

    if (!fse.existsSync(chunkPath)) {
      await fse.mkdir(chunkPath)
    }

    console.log(file)
    fse.move(file.filepath, `${chunkPath}/${name}`)
    this.message('切片上传成功')
  }
  async sendMailer() {
    const { ctx } = this
    const email = ctx.query.email
    const text = Math.random().toString().slice(2, 6)
    ctx.session.emailCode = text
    const subText = 'test'
    const html = `<h2>验证码：${text}</h2>`
    const res = await this.service.utils.email(email, subText, text, html)
    console.log(text)
    if (res) {
      this.success('发送成功')
    } else {
      this.error('发送失败')
    }
  }
}

module.exports = UtilsController
