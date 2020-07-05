import * as chai from 'chai'
import CssRender from 'css-render'
import { assertEqual } from '@css-render/shared/utils'

const expect = chai.expect
const cssr = CssRender()

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
  it('should support props of render', () => {
    sandbox.innerHTML = '<sel1></sel1>'
    const style = c('sel1', ({ props }) => {
      return {
        backgroundColor: props.color
      }
    })
    style.mount({
      props: {
        color: 'red'
      }
    })
    const backgroundColor = getComputedStyle(sandbox.children[0]).backgroundColor
    expect(backgroundColor).to.equal('rgb(255, 0, 0)')
  })
  after(() => {
    document.body.removeChild(sandbox)
    style.unmount()
  })
})

describe('# mount & unmount with id (count)', () => {
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
  it('should mount desired style element on head', () => {
    expect(document.head.querySelector('[cssr-id="test-id-1"]'))
      .not.to.equal(null)
    expect(document.head.querySelector('[cssr-id="14138"]'))
      .not.to.equal(null)
  })
  it('should do nothing when unmount with an not exist id', () => {
    style.unmount({
      target: 'letitbe'
    })
    expect(style.els.length).to.equal(4)
  })
  it('should unmount the desired style element', () => {
    style.unmount({
      target: 'test-id-1'
    })
    style.unmount({
      target: 14138
    })
    expect(document.head.querySelector('[cssr-id="test-id-1"]'))
      .to.equal(null)
    expect(document.head.querySelector('[cssr-id="test-id-2"]'))
      .not.to.equal(null)
    expect(document.head.querySelector('[cssr-id="14138"]'))
      .to.equal(null)
    expect(document.head.querySelector('[cssr-id="14139"]'))
      .not.to.equal(null)
    expect(style.els.length).to.equal(2)
  })
  it('should be mounted to target element when a element is passed', () => {
    const styleElement = document.createElement('style')
    style.mount({
      target: styleElement
    })
    expect(styleElement.innerHTML.length).to.not.equal(0)
  })
  it('should unmount all related styles elements', () => {
    style.unmount()
    expect(style.els.length).to.equal(0)
  })
  it('should mount element with mount count', () => {
    const styleElement = style.mount({
      target: 14138
    })
    expect(styleElement.getAttribute('mount-count')).to.equal('1')
    style.mount({
      target: 14138
    })
    expect(styleElement.getAttribute('mount-count')).to.equal('2')
    style.mount({
      target: 14138
    })
    expect(styleElement.getAttribute('mount-count')).to.equal('3')
  })
  it('should minus mount count when mounted multiple times', () => {
    const styleElement = style.mount({
      target: 14138
    })
    style.unmount({
      target: 14138
    })
    expect(styleElement.getAttribute('mount-count')).to.equal('3')
    style.unmount({
      target: 14138
    })
    expect(styleElement.getAttribute('mount-count')).to.equal('2')
    style.unmount({
      target: 14138
    })
    expect(styleElement.getAttribute('mount-count')).to.equal('1')
    expect(styleElement.parentElement).not.to.equal(null)
    style.unmount({
      target: 14138
    })
    expect(styleElement.parentElement).to.equal(null)
  })
  it('should not mount when target is null', () => {
    style.unmount()
    const el = style.mount({
      target: null
    })
    expect(el)
      .to.equal(null)
    style.unmount({
      target: null
    })
  })
  it('should unmount style when mount-count is 1', function () {
    style.mount({ target: 14140 })
    expect(document.head.querySelector('[cssr-id="14140"]'))
      .not.to.equal(null)
    style.unmount({ target: 14140 })
    expect(document.head.querySelector('[cssr-id="14140"]'))
      .to.equal(null)
  })
  after(() => {
    style.unmount()
  })
})

describe('# mount & unmount with id (not count)', function () {
  const style = c('.red-block', {
    backgroundColor: 'red'
  })
  afterEach(() => {
    style.unmount()
  })
  it('should mount a element without [mount-count] if option.count is false', function () {
    const el = style.mount({
      target: 14138,
      count: false
    })
    expect(el.getAttribute('mount-count')).to.equal(null)
    const el2 = style.mount({
      target: 14138,
      count: false
    })
    expect(el).to.equal(el2)
    expect(el2.getAttribute('mount-count')).to.equal(null)
  })
  it('should not modify mount count if options.count is false', function () {
    const el = style.mount({
      target: 14138,
      count: false
    })
    style.mount({
      target: 14138
    })
    expect(el.getAttribute('mount-count')).to.equal('1')
  })
  it('should unmount all id related if options.count is false', function () {
    style.mount({
      target: 14138
    })
    style.mount({
      target: 14138
    })
    style.unmount({
      target: 14138,
      count: false
    })
    expect(document.head.querySelector('[cssr-id="14138"]'))
      .to.equal(null)
  })
  describe('should unmount style when mount option.count = false and unmount options.count is true', () => {
    it('#case1', () => {
      style.mount({ target: 14138, count: false })
      style.unmount({ target: 14138 })
      expect(document.head.querySelector('[cssr-id="14138"]'))
        .to.equal(null)
    })
  })
})

describe('# mount & unmount with element target', function () {
  describe('# basic case', () => {
    const style = c('.red-block', {
      backgroundColor: 'red'
    })
    const style2 = c('.red-block', {
      backgroundColor: 'red'
    })
    const styleEl = document.createElement('style')
    it('should be mounted to the specified element', () => {
      style.mount({ target: styleEl })
      assertEqual(styleEl.innerHTML, `.red-block {
        background-color: red;
      }`)
      expect(styleEl.getAttribute('mount-count')).to.equal('1')
      style.mount({ target: styleEl })
      expect(styleEl.getAttribute('mount-count')).to.equal('2')
    })
    it('should minus count after being unmounted', () => {
      style.unmount({ target: styleEl })
      expect(styleEl.getAttribute('mount-count')).to.equal('1')
    })
    it('should remove mount count attribute after call unmount when mount-count is 1', () => {
      style.unmount({ target: styleEl })
      expect(styleEl.getAttribute('mount-count')).to.equal(null)
    })
    describe('shouldn\'t add mount-count on target when mount option.count false', () => {
      it('#case1', () => {
        const styleEl2 = document.createElement('style')
        style.mount({ target: styleEl2, count: false })
        expect(styleEl2.getAttribute('mount-count')).to.equal(null)
      })
      it('#case2', () => {
        style.mount({ target: styleEl })
        style.mount({ target: styleEl, count: false })
        expect(styleEl.getAttribute('mount-count')).to.equal('1')
      })
    })
    describe('should clear style when mount option.count = false and unmount options.count is true', () => {
      it('#case1', () => {
        const styleEl2 = document.createElement('style')
        style.mount({ target: styleEl2, count: false })
        assertEqual(styleEl2.innerHTML, `.red-block {
          background-color: red;
        }`)
        style.unmount({ target: styleEl2 })
        assertEqual(styleEl2.innerHTML, '')
      })
    })
    it('should clear style when unmount option.count = false #1', () => {
      style.mount({ target: styleEl })
      style.mount({ target: styleEl })
      assertEqual(styleEl.innerHTML, `.red-block {
        background-color: red;
      }`)
      style.unmount({ target: styleEl, count: false })
      assertEqual(styleEl.innerHTML, '')
    })
    it('should not reset innerHTML when style is same', () => {
      const styleEl2 = document.createElement('style')
      style.mount({ target: styleEl2, count: false })
      style2.mount({ target: styleEl2, count: false })
      // for coverage, no assert
    })
  })
})

describe('# unmount with delay', () => {
  const style = c('.red-block', {
    backgroundColor: 'red'
  })
  it('should delay unmount when delay is set', function (done) {
    style.mount({
      target: 14138
    })
    style.unmount({
      target: 14138,
      delay: 100
    })
    expect(document.head.querySelector('[cssr-id="14138"]'))
      .not.to.equal(null)
    setTimeout(() => {
      expect(document.head.querySelector('[cssr-id="14138"]'))
        .to.equal(null)
      done()
    }, 200)
  })
  it('should keep element if mount before unmount fired', function (done) {
    style.mount({
      target: 14138
    })
    style.unmount({
      target: 14138,
      delay: 133
    })
    setTimeout(() => {
      style.mount({
        target: 14138
      })
    }, 67)
    setTimeout(() => {
      expect(document.head.querySelector('[cssr-id="14138"]'))
        .not.to.equal(null)
      done()
    }, 200)
  })
})
