import * as chai from 'chai'
import CSSRender from 'css-render'

const expect = chai.expect
const cssr = CSSRender()

const {
  h
} = cssr

describe('# mount', () => {
  let sandbox: HTMLElement
  const style = h('.red-block', {
    backgroundColor: 'red'
  })
  before(() => {
    style.mount()
    sandbox = document.createElement('div')
    document.body.appendChild(sandbox)
    console.log('head', document.head.outerHTML)
  })
  afterEach(() => {
    sandbox.innerHTML = ''
  })
  it('should make element styled', () => {
    sandbox.innerHTML = '<div class="red-block"></div>'
    const backgroundColor = getComputedStyle(sandbox.children[0]).backgroundColor
    expect(backgroundColor).to.equal('rgb(255, 0, 0)')
  })
  after(() => {
    document.body.removeChild(sandbox)
    style.unmount()
  })
})
