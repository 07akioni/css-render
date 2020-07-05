const shell = require('shelljs')
const path = require('path')

/** clean soft links */

shell.rm(
  '-f',
  path.resolve(__dirname, '..', 'node_modules', 'css-render')
)

shell.rm(
  '-rf',
  path.resolve(__dirname, '..', 'node_modules', '@css-render')
)
