process.env.CHROME_BIN = require('puppeteer').executablePath()
const pluginKarmaMocha = require('karma-mocha')
const pluginKarmaTypescript = require('karma-typescript')
const pluginKarmaChromeLauncher = require('karma-chrome-launcher')
const pluginKarmaSpecReporter = require('karma-spec-reporter')

module.exports = function (config) {
  config.set({
    singleRun: true,
    browsers: ['ChromeHeadless'],
    plugins: [
      pluginKarmaMocha,
      pluginKarmaTypescript,
      pluginKarmaChromeLauncher,
      pluginKarmaSpecReporter
    ],
    frameworks: ['mocha', 'karma-typescript'],
    files: [
      'src/**/*.ts',
      '__tests__/**/*.ts'
    ],
    preprocessors: {
      'src/**/*.ts': 'karma-typescript',
      '__tests__/**/*.ts': 'karma-typescript'
    },
    reporters: ['spec', 'karma-typescript'],
    karmaTypescriptConfig: {
      compilerOptions: {
        module: 'CommonJS',
        inlineSourceMap: true
      },
      reports: {
        text: '',
        html: {
          directory: 'coverage',
          subdirectory: 'html'
        },
        lcovonly: {
          directory: 'coverage',
          subdirectory: 'lcov'
        }
      },
      tsconfig: './tsconfig.json'
    }
  })
}
