import * as chai from 'chai'
const expect = chai.expect

export function assertEqual (pattern: string, targetPattern: string): Chai.Assertion {
  return expect(
    pattern.replace(/\s+/g, ' ').replace(/\{\s+\}/g, '{}').trim()
  )
    .to.equal(
      targetPattern.replace(/\s+/g, ' ').replace(/\{\s+\}/g, '{}').trim()
    )
}
