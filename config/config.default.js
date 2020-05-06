/* eslint valid-jsdoc: "off" */

'use strict'
const path = require('path')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1588658293303_1341'
  config.multipart = {
    name: 'file',
    whitelist: () => true,
  }
  config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public')
  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  return {
    ...config,
    ...userConfig,
    security: {
      csrf: {
        enable: false,
      },
    },
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/hub',
        options: {

        },
      },
    },
    jwt: {
      secret: 'dasdaswqddqwcsads',
    },
  }
}
