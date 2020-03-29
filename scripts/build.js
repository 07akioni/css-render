const execa = require('execa')
const fs = require('fs')
const chalk = require('chalk')
const path = require('path')

const packagesDir = path.resolve(__dirname, '..', 'packages')
const buildConfigFileName = 'tsconfig.build.json'

function getBuildTargets () {
  const buildTargets = []
  function traverse (dir) {
    if (!fs.statSync(dir).isDirectory()) return
    const fileList = fs.readdirSync(dir)
    const configExists = fileList.includes(buildConfigFileName)
    if (configExists) {
      buildTargets.push(dir)
      return
    }
    fileList.forEach(fileName => traverse(path.resolve(dir, fileName)))
  }
  traverse(packagesDir)
  return buildTargets
}

const build = async (targetDir) => {
  const configFilePath = path.resolve(targetDir, 'package.json')
  const config = require(configFilePath)
  console.log('Building package [', config.name, ']')
  try {
    await execa('tsc', ['-b', buildConfigFileName], {
      cwd: targetDir
    })
  } catch (error) {
    console.log(chalk.bold(chalk.red(error.stdout)))
  }
}

const runBuild = async () => {
  const targets = getBuildTargets()
  targets.forEach(build)
}

runBuild()
