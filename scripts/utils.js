const path = require('path')
const fs = require('fs')

const { buildConfigFileNames, packagesDir } = require('./config')

exports.getBuildTargets = function () {
  const buildTargets = []
  function traverse (dir) {
    if (!fs.statSync(dir).isDirectory()) return
    const fileList = fs.readdirSync(dir)
    const configExists = buildConfigFileNames.every(fileName => fileList.includes(fileName))
    if (configExists) {
      buildTargets.push(dir)
      return
    }
    fileList.forEach(fileName => traverse(path.resolve(dir, fileName)))
  }
  traverse(packagesDir)
  return buildTargets
}
