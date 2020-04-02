const path = require('path')
const fs = require('fs')
const execa = require('execa')
const shell = require('shelljs')

const packageConfig = require('../package.json')
const { getBuildTargets } = require('./utils')

function copyReadme () {
  shell.cp(
    path.resolve(__dirname, '..', 'README.md'),
    path.resolve(__dirname, '..', 'packages', 'core')
  )
}

function updateSubmodulePackageJSON (filePath, packageConfig) {
  const config = require(filePath)
  console.log('  Update version of package [', config.name, ']')
  config.version = packageConfig.version
  /**
   * Maybe later I need to update dependencies automatically.
   * So keep the code here waiting to be refined.
   * console.log('  Update dependencies of package [', config.name, ']')
   * config.dependencies = packageConfig.dependencies
   */
  fs.writeFileSync(filePath, JSON.stringify(config, 0, 2))
}

async function main () {
  /** copy readme from project root to core package */
  console.log('Copy readme from project root to core package')
  copyReadme()
  const buildTargets = getBuildTargets()
  console.log('Update version', packageConfig.version)
  buildTargets.forEach(target => {
    updateSubmodulePackageJSON(
      path.resolve(target, 'package.json'),
      packageConfig
    )
  })
  console.log()
  console.log('Publish')
  for (const target of buildTargets) {
    try {
      const result = await execa('npm', [
        'publish',
        '--access=public'
      ], {
        cwd: target
      })
      console.log(result.stdout)
    } catch (error) {
      console.log(error)
    }
  }
}

main()
