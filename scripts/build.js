const execa = require('execa')
const chalk = require('chalk')
const path = require('path')
const rimraf = require('rimraf')

const { buildConfigFileNames } = require('./config')
const { getBuildTargets } = require('./utils')

function getModuleExtensionName (fileName) {
  return fileName.split('.').reverse()[1]
}

const build = async (targetDir) => {
  const packageConfigFilePath = path.resolve(targetDir, 'package.json')
  const packageConfig = require(packageConfigFilePath)
  for (const buildConfigFileName of buildConfigFileNames) {
    const moduleExtensitionName = getModuleExtensionName(buildConfigFileName)
    const buildConfigFilePath = path.resolve(targetDir, buildConfigFileName)
    const buildConfig = require(buildConfigFilePath)
    const outDir = buildConfig.compilerOptions && buildConfig.compilerOptions.outDir
    if (outDir) {
      rimraf.sync(path.resolve(targetDir, outDir))
    } else {
      throw Error('  package [', packageConfig.name, '] has no outDir')
    }
    console.log('  Building package [', packageConfig.name, '] (', moduleExtensitionName, ')')
    try {
      await execa('tsc', ['-b', buildConfigFileName], {
        cwd: targetDir
      })
    } catch (error) {
      console.log(chalk.bold(chalk.red(error.stdout)))
    }
  }
}

const runBuild = async () => {
  const targets = getBuildTargets()
  console.log('Build libs')
  for (const target of targets) {
    await build(target)
  }
  console.log('Build bundles')
  console.log('  Remove dist files')
  for (const target of targets) {
    rimraf.sync(path.resolve(target, 'dist'))
  }
  console.log()
}

runBuild()
