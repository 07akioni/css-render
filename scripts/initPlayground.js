const shell = require('shelljs')
const path = require('path')

/** soft link bundle package to node_modules, it makes test locally possible */

shell.ln('-sf',
  path.resolve(__dirname, '..', 'packages', 'core'),
  path.resolve(__dirname, '..', 'node_modules', 'css-render')
)

shell.mkdir('-p', path.resolve(__dirname, '..', 'node_modules', '@css-render'))

shell.ln('-sf',
  path.resolve(__dirname, '..', 'packages', 'plugins', 'bem'),
  path.resolve(__dirname, '..', 'node_modules', '@css-render', 'plugin-bem')
)
