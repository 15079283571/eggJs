'use strict'

const nodeMailer = require('nodemailer')
const { Service } = require('egg')
const userEmail = 'm15079283571@163.com'

const transporter = nodeMailer.createTransport({
  service: '163',
  // secure: false,
  secureConnection: true,
  auth: {
    user: userEmail,
    pass: '邮箱pop3的授权码',
  },
})

class UtilsService extends Service {
  async email(email, subText, text, html) {
    try {
      await transporter.sendMail({
        from: userEmail,
        cc: userEmail,
        to: email,
        subject: subText,
        text,
        html,
      })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
module.exports = UtilsService
