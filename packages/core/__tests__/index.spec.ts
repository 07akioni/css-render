import * as chai from 'chai'
import parsePaths from '@css-render/core/src/parseSelectorPath'
import pathTestCases from './pathTestCases'

const expect = chai.expect

describe('pathTest', () => {
  pathTestCases.forEach(testCase => {
    it(`pathTest ${testCase.input.toString()} should be ${testCase.output}`, () => {
      expect(parsePaths(testCase.input)).to.equal(testCase.output)
    })
  })
})
