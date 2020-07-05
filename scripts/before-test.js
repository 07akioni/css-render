const fs = require('fs')
const path = require('path')

const csstypeModulePath = path.resolve(__dirname, '..', 'node_modules', 'csstype')

/** create a index.js to avoid errors of karma-typescript */
if (fs.existsSync(
  csstypeModulePath
)) {
  fs.writeFileSync(path.resolve(
    csstypeModulePath,
    'index.js'
  ), '')
}
