import parsePaths from '../src/parseSelectorPath'
import pathTestCases from './pathTestCases'

pathTestCases.forEach(testCase => {
  console.log('input <===', testCase.input)
  const output = parsePaths(testCase.input)
  console.log('output ===>', output === testCase.output, output)
})