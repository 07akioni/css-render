const path = require('path')
const fs = require('fs')
const execa = require('execa')

const packageConfig = require('../package.json')
const { getBuildTargets } = require('./utils')

function updateVersion (filePath, version) {
  const config = require(filePath)
  console.log('  Update version of package [', config.name, ']')
  config.version = version
  fs.writeFileSync(filePath, JSON.stringify(config, 0, 2))
}

async function main () {
  const buildTargets = getBuildTargets()
  console.log('Update version', packageConfig.version)
  buildTargets.forEach(target => {
    updateVersion(
      path.resolve(target, 'package.json'),
      packageConfig.version
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
