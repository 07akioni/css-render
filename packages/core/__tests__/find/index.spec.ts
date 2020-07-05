import * as chai from 'chai'
import CssRender from 'css-render'

const expect = chai.expect
const cssr = CssRender()

const {
  c, find
} = cssr

describe('# find', () => {
  const style = c('.red-block', {
    backgroundColor: 'red'
  })
  before(() => {
    style.mount({
      target: 'test-id-1'
    })
    style.mount({
      target: 'test-id-2'
    })
    style.mount({
      target: 14138
    })
    style.mount({
      target: 14139
    })
  })
  after(() => style.unmount())
  it('works', () => {
    expect(find(14138)).not.to.equal(null)
    expect(find(14139)).not.to.equal(null)
    expect(find('test-id-1')).not.to.equal(null)
    expect(find('test-id-2')).not.to.equal(null)
    expect(find('gogogo')).to.equal(null)
    expect(find('kirby')).to.equal(null)
  })
})
