import * as chai from 'chai'
import { parseSelectorPath } from '@css-render/core/src/parse'
import pathTestCases from './pathTestCases'

const expect = chai.expect

describe('# parse selector path', () => {
  pathTestCases.forEach(testCase => {
    it(`pathTest ${testCase.input.toString()} should be ${testCase.output}`, () => {
      expect(parseSelectorPath(testCase.input)).to.equal(testCase.output)
    })
  })
})
