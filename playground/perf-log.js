const { execSync } = require('child_process')

const loopTimes = 100
const trimmedLength = 20

let log = '-----log-start-----\n'

const gitHash = execSync('git rev-parse HEAD').toString().trim()
log += ('Commit hash  : ' + gitHash + '\n')
log += ('Raw logs     : ')

const timeList = []

for (let i = 0; i < loopTimes; ++i) {
  const output = execSync('node playground/button.perf.js')
  const time = Number(Number(output.toString()).toFixed(2))
  timeList.push(time)
  log += (time + ',')
}

const trimmedTimeList = timeList.sort().slice(
  trimmedLength / 2 - 1,
  loopTimes - trimmedLength / 2
)

const sum = trimmedTimeList.reduce((prevValue, currentValue) => prevValue + currentValue, 0)

log += '\n'
log += ('Max time     : ' + Math.max(...timeList) + '\n')
log += ('Min time     : ' + Math.min(...timeList) + '\n')
log += ('Average time : ' + (sum / (loopTimes - trimmedLength)).toFixed(4) + '\n')
log += '------log-end------\n'

console.log(log)
