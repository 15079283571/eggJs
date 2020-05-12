'use strict'

const nodeMailer = require('nodemailer')
const { Service } = require('egg')
const userEmail = 'm15079283571@163.com'
const path = require('path')
const fse = require('fs-extra')

const transporter = nodeMailer.createTransport({
  service: '163',
  // secure: false,
  secureConnection: true,
  auth: {
    user: userEmail,
    pass: 'EDDCATCBVVQDRQWR',
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
  async mergeFile(filePath, hash, size) {
    const chunkDir = path.resolve(this.config.UPLOAD_DIR, hash)
    let chunks = await fse.readdir(chunkDir)
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1])
    chunks = chunks.map(item => path.resolve(chunkDir, item))
    await this.mergeChunks(chunks, filePath, size)
  }
  async mergeChunks(files, dest, size) {
    const pipStream = (filePath, writeStream) => new Promise(resolve => {
      const readStream = fse.createReadStream(filePath)
      readStream.on('end', () => {
        fse.unlinkSync(filePath)
        resolve()
      })
      readStream.pipe(writeStream)
    })
    await Promise.all(
      // eslint-disable-next-line array-callback-return
      files.map((file, index) => {
        return pipStream(file, fse.createWriteStream(dest, {
          start: index * size,
          end: (index + 1) * size,
        }))
      })
    )
  }
}
module.exports = UtilsService
