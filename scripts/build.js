const execa = require('execa')
const fs = require('fs')
const chalk = require('chalk')

const buildEntriesDir = ['core', 'plugins']
const buildConfigFileName = 'tsconfig.build.json'

const getBuildTargets = () => {
  return buildEntriesDir.reduce((preTargets, currentDir) => {
    const dir = `packages/${currentDir}`
    let currentTargets = []
    if (fs.existsSync(`${dir}/${buildConfigFileName}`)) {
      currentTargets = dir
    } else {
      currentTargets = fs.readdirSync(dir).filter((file) => {
        if (!fs.statSync(`${dir}/${file}`).isDirectory()) {
          return false
        }
        if (!fs.existsSync(`${dir}/${file}/${buildConfigFileName}`)) {
          return false
        }
        return true
      }).map((dirName) => {
        return `${dir}/${dirName}`
      })
    }
    return preTargets.concat(currentTargets)
  }, [])
}

const build = async (targetDir) => {
  try {
    await execa('tsc', ['-b', buildConfigFileName], {
      cwd: targetDir
    })
  } catch (error) {
    console.log(chalk.bold(chalk.red(error.stdout)))
  }
}

const runBuild = async () => {
  const targets = await getBuildTargets()
  targets.forEach(build)
}

runBuild()
