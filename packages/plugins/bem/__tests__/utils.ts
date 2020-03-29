import * as chai from 'chai'
const expect = chai.expect

export function isSame (pattern: string, targetPattern: string): Chai.Assertion {
  return expect(pattern.replace(/\s/g, '') === targetPattern.replace(/\s/g, ''))
}
