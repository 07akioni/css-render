import * as chai from 'chai'
import { p$p } from '@css-render/core/src/parse'
import pathTestCases from './pathTestCases.spec'

const expect = chai.expect

const _sr = /,(?![^(]*\))/

function normalizeSelector (selector: string): string {
  // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
  return selector
    .split(_sr)
    .map(part => part.trim())
    .sort()
    .join(', ')
}

describe('# parse selector path', () => {
  pathTestCases.forEach(testCase => {
    it(`parse result of ${testCase.input.toString()} should be ${testCase.output}`, () => {
      expect(normalizeSelector(p$p(testCase.input))).to.equal(normalizeSelector(testCase.output))
    })
  })
})
