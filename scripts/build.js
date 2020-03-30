const execa = require('execa')
const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const rimraf = require('rimraf')

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
  const packageConfigFilePath = path.resolve(targetDir, 'package.json')
  const packageConfig = require(packageConfigFilePath)
  const buildConfigFilePath = path.resolve(targetDir, buildConfigFileName)
  const buildConfig = require(buildConfigFilePath)
  const outDir = buildConfig.compilerOptions && buildConfig.compilerOptions.outDir
  if (outDir) {
    rimraf.sync(path.resolve(targetDir, outDir))
  } else {
    throw Error('package [', packageConfig.name, '] has no outDir')
  }
  console.log('Building package [', packageConfig.name, ']')
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
