import * as chai from 'chai'
import { p$p } from '@css-render/core/src/parse'
import pathTestCases from './pathTestCases.spec'

const expect = chai.expect

describe('# parse selector path', () => {
  pathTestCases.forEach(testCase => {
    it(`parse result of ${testCase.input.toString()} should be ${testCase.output}`, () => {
      expect(p$p(testCase.input)).to.equal(testCase.output)
    })
  })
})
