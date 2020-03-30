const path = require('path')

module.exports = {
  buildConfigFileName: 'tsconfig.build.json',
  packagesDir: path.resolve(__dirname, '..', 'packages')
}
