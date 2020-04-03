const execa = require('execa')
const chalk = require('chalk')
const path = require('path')
const rimraf = require('rimraf')
const shell = require('shelljs')
const fs = require('fs')
const rollup = require('rollup')

const { buildConfigFileNames } = require('./config')
const { getBuildTargets } = require('./utils')

function copyReadme () {
  shell.cp(
    path.resolve(__dirname, '..', 'README.md'),
    path.resolve(__dirname, '..', 'packages', 'core')
  )
}

function getModuleExtensionName (fileName) {
  return fileName.split('.').reverse()[1]
}

const buildLib = async (targetDir) => {
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

const buildDist = async (targetDir) => {
  const rollupConfigPath = path.resolve(targetDir, 'rollup.config.js')
  if (!fs.existsSync(rollupConfigPath)) return
  console.log('  Rollup!')
  const config = require(rollupConfigPath)
  const bundle = await rollup.rollup(config.input)
  for (const outputOptions of config.output) {
    await bundle.write(outputOptions)
  }
}

const runBuild = async () => {
  /** copy readme from project root to core package */
  console.log('Copy readme from project root to core package')
  copyReadme()
  console.log()
  const targets = getBuildTargets()
  console.log('Build libs')
  for (const target of targets) {
    await buildLib(target)
  }
  console.log('Build bundles')
  console.log('  Remove dist files')
  for (const target of targets) {
    rimraf.sync(path.resolve(target, 'dist'))
    await buildDist(target)
  }
  console.log()
}

runBuild()
