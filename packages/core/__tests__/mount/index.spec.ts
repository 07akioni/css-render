import * as chai from 'chai'
import { CSSRender } from 'css-render'

const expect = chai.expect
const cssr = CSSRender()

const {
  h, mount
} = cssr

function teardown (el: HTMLStyleElement): void {
  if (el.parentElement !== null) {
    el.parentElement.removeChild(el)
  }
}

describe('# mount', () => {
  let styleEl: HTMLStyleElement
  let sandbox: HTMLElement
  before(() => {
    const style = h('.red-block', {
      backgroundColor: 'red'
    })
    styleEl = mount(style, 'style-id')
    sandbox = document.createElement('div')
    document.body.appendChild(sandbox)
  })
  afterEach(() => {
    sandbox.innerHTML = ''
  })
  it('should mount style node on head', () => {
    expect(document.head.contains(styleEl)).to.equal(true)
  })
  it('should make element styled', () => {
    sandbox.innerHTML = '<div class="red-block"></div>'
    const backgroundColor = getComputedStyle(sandbox.children[0]).backgroundColor
    expect(backgroundColor).to.equal('rgb(255, 0, 0)')
  })
  after(() => {
    document.body.removeChild(sandbox)
    teardown(styleEl)
  })
})
