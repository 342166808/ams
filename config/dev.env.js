'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"https://www.fastmock.site/mock/b4a8e34133ea0e029607f77a4733b80a/ams"'
  BASE_API: '"http://47.100.170.170:802"'
})
