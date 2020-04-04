import * as chai from 'chai'
import CSSRender from 'css-render'

const expect = chai.expect
const cssr = CSSRender()

const {
  c
} = cssr

describe('# mount with no target', () => {
  let sandbox: HTMLElement
  const style = c('.red-block', {
    backgroundColor: 'red'
  })
  before(() => {
    style.mount()
    sandbox = document.createElement('div')
    document.body.appendChild(sandbox)
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

describe('# mount & unmount with id', () => {
  let sandbox: HTMLElement
  const style = c('.red-block', {
    backgroundColor: 'red'
  })
  before(() => {
    style.mount('test-id-1')
    style.mount('test-id-2')
    style.mount(14138)
    style.mount(14139)
    sandbox = document.createElement('div')
    document.body.appendChild(sandbox)
  })
  afterEach(() => {
    sandbox.innerHTML = ''
  })
  it('should mounted desired style element on head', () => {
    expect(document.head.querySelector('[css-render-id="test-id-1"]'))
      .not.to.equal(null)
    expect(document.head.querySelector('[css-render-id="14138"]'))
      .not.to.equal(null)
  })
  it('should use unmount the desired style element', () => {
    style.unmount('test-id-1')
    style.unmount(14138)
    expect(document.head.querySelector('[css-render-id="test-id-1"]'))
      .to.equal(null)
    expect(document.head.querySelector('[css-render-id="test-id-2"]'))
      .not.to.equal(null)
    expect(document.head.querySelector('[css-render-id="14138"]'))
      .to.equal(null)
    expect(document.head.querySelector('[css-render-id="14139"]'))
      .not.to.equal(null)
    expect(style.els.length).to.equal(2)
  })
  it('should be mounted to target element is a element is passed', () => {
    const styleElement = document.createElement('style')
    style.mount(styleElement)
    expect(styleElement.innerHTML.length).to.not.equal(0)
  })
  it('should unmount all related styles elements', () => {
    style.unmount()
    expect(style.els.length).to.equal(0)
  })
  it('should mount element with mount count', () => {
    const styleElement = style.mount(14138)
    expect(styleElement.getAttribute('mount-count')).to.equal('1')
    style.mount(14138)
    expect(styleElement.getAttribute('mount-count')).to.equal('2')
    style.mount(14138)
    expect(styleElement.getAttribute('mount-count')).to.equal('3')
  })
  it('should minus mount count when mounted multiple times', () => {
    const styleElement = style.mount(14138)
    style.unmount(14138)
    expect(styleElement.getAttribute('mount-count')).to.equal('3')
    style.unmount(14138)
    expect(styleElement.getAttribute('mount-count')).to.equal('2')
    style.unmount(14138)
    expect(styleElement.getAttribute('mount-count')).to.equal('1')
    expect(styleElement.parentElement).not.to.equal(null)
    style.unmount(14138)
    expect(styleElement.parentElement).to.equal(null)
  })
  after(() => {
    document.body.removeChild(sandbox)
    style.unmount()
  })
})
