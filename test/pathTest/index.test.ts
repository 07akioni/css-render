import * as chai from "chai";
import parsePaths from '../../src/parseSelectorPath'
import pathTestCases from './pathTestCases'

const expect = chai.expect;

describe(`pathTest`,()=>{
  
  pathTestCases.forEach(testCase => {
    it(`pathTest ${testCase.input} should be ${testCase.output}`,()=>{
      expect(parsePaths(testCase.input)).to.equal(testCase.output);
    })
    // console.log('input <===', testCase.input)
    // const output = parsePaths(testCase.input)
    // console.log('output ===>', output === testCase.output, output)
  })
})
