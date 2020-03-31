const path = require('path')

module.exports = {
  buildConfigFileNames: ['tsconfig.build.cjs.json', 'tsconfig.build.esm.json'],
  packagesDir: path.resolve(__dirname, '..', 'packages')
}
