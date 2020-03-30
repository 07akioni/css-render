import * as chai from 'chai'
import { CSSRender } from 'css-render'
import { parseSelectorPath } from '@css-render/core/src/parse'
import pathTestCases from './pathTestCases.spec'

const expect = chai.expect
const cssr = CSSRender()

describe('# parse selector path', () => {
  pathTestCases.forEach(testCase => {
    it(`parse result of ${testCase.input.toString()} should be ${testCase.output}`, () => {
      expect(parseSelectorPath(testCase.input, cssr)).to.equal(testCase.output)
    })
  })
})
