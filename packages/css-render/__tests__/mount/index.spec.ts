/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as chai from 'chai'
import CssRender from '../../src'
import { SinonSpy, spy } from 'sinon'

const expect = chai.expect
const cssr = CssRender()

const { c } = cssr

describe('# mount with no id', () => {
  let sandbox: HTMLElement
  const style = c('.red-block', {
    backgroundColor: 'red'
  })
  before(() => {
    style.mount()
    sandbox = document.createElement('div')
    document.body.appendChild(sandbox)
  })
  beforeEach(() => {
    spy(console, 'error')
  })
  afterEach(() => {
    (console.error as SinonSpy).restore()
    sandbox.innerHTML = ''
  })
  it('should mount only once', () => {
    expect(document.querySelectorAll('[cssr-id]').length).to.equal(1)
    style.mount()
    expect(document.querySelectorAll('[cssr-id]').length).to.equal(1)
  })
  it('should make element styled', () => {
    sandbox.innerHTML = '<div class="red-block"></div>'
    const backgroundColor = getComputedStyle(
      sandbox.children[0]
    ).backgroundColor
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
    const backgroundColor = getComputedStyle(
      sandbox.children[0]
    ).backgroundColor
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
      id: 'test-id-1',
      count: true
    })
    style.mount({
      id: 'test-id-2',
      count: true
    })
    style.mount({
      id: '14138',
      count: true
    })
    style.mount({
      id: '14139',
      count: true
    })
  })
  beforeEach(() => {
    spy(console, 'error')
  })
  afterEach(() => {
    (console.error as SinonSpy).restore()
  })
  it('should work in no-count mode', () => {
    style.mount({ id: 'jjy' })
    expect(document.head.querySelector('[cssr-id="jjy"]')).not.to.eq(null)
    style.unmount({ id: 'jjy' })
    expect(document.head.querySelector('[cssr-id="jjy"]')).to.eq(null)
  })
  it('should mount desired style element on head', () => {
    expect(document.head.querySelector('[cssr-id="test-id-1"]')).not.to.equal(
      null
    )
    expect(document.head.querySelector('[cssr-id="14138"]')).not.to.equal(null)
  })
  it('should do nothing when unmount with an not exist id', () => {
    style.unmount({
      id: 'letitbe'
    })
    expect(style.els.length).to.equal(4)
  })
  it('should unmount the desired style element', () => {
    style.unmount({
      id: 'test-id-1',
      count: true
    })
    style.unmount({
      id: '14138',
      count: true
    })
    expect(document.head.querySelector('[cssr-id="test-id-1"]')).to.equal(null)
    expect(document.head.querySelector('[cssr-id="test-id-2"]')).not.to.equal(
      null
    )
    expect(document.head.querySelector('[cssr-id="14138"]')).to.equal(null)
    expect(document.head.querySelector('[cssr-id="14139"]')).not.to.equal(null)
    expect(style.els.length).to.equal(2)
  })
  it('should unmount all related styles elements', () => {
    style.unmount()
    expect(style.els.length).to.equal(0)
  })
  it('should mount element with mount count', () => {
    const styleElement = style.mount({
      id: '14138',
      count: true
    })
    expect(styleElement.getAttribute('mount-count')).to.equal('1')
    style.mount({
      id: '14138',
      count: true
    })
    expect(styleElement.getAttribute('mount-count')).to.equal('2')
    style.mount({
      id: '14138',
      count: true
    })
    expect(styleElement.getAttribute('mount-count')).to.equal('3')
  })
  it('should minus mount count when mounted multiple times', () => {
    const styleElement = style.mount({
      id: '14138',
      count: true
    })
    style.unmount({
      id: '14138',
      count: true
    })
    expect(styleElement.getAttribute('mount-count')).to.equal('3')
    style.unmount({
      id: '14138',
      count: true
    })
    expect(styleElement.getAttribute('mount-count')).to.equal('2')
    style.unmount({
      id: '14138',
      count: true
    })
    expect(styleElement.getAttribute('mount-count')).to.equal('1')
    expect(styleElement.parentElement).not.to.equal(null)
    style.unmount({
      id: '14138',
      count: true
    })
    expect(styleElement.parentElement).to.equal(null)
  })
  it('should unmount style when mount-count is 1', function () {
    style.mount({ id: '14140', count: true })
    expect(document.head.querySelector('[cssr-id="14140"]')).not.to.equal(null)
    style.unmount({ id: '14140', count: true })
    expect(document.head.querySelector('[cssr-id="14140"]')).to.equal(null)
  })
  after(() => {
    style.unmount()
  })
})

describe('# mount & unmount with id (not count)', function () {
  const style = c('.red-block', {
    backgroundColor: 'red'
  })
  beforeEach(() => {
    spy(console, 'error')
  })
  afterEach(() => {
    (console.error as SinonSpy).restore()
    style.unmount()
  })
  it('should mount a element without [mount-count] if option.count is false', function () {
    const el = style.mount({
      id: '14141'
    })
    expect(el.getAttribute('mount-count')).to.equal(null)
    const el2 = style.mount({
      id: '14141'
    })
    expect(el).to.equal(el2)
    expect(el2.getAttribute('mount-count')).to.equal(null)
  })
  it('should not modify mount count if options.count is false', function () {
    const el = style.mount({
      id: '14142',
      count: true
    })
    style.mount({
      id: '14142',
      count: false
    })
    expect(el.getAttribute('mount-count')).to.equal('1')
    expect((console.error as SinonSpy).calledOnce).to.equal(true)
  })
  it('should unmount all id related if options.count is false', function () {
    style.mount({
      id: '14143',
      count: true
    })
    style.mount({
      id: '14143',
      count: true
    })
    style.unmount({
      id: '14143'
    })
    expect(
      document.head
        .querySelector('[cssr-id="14143"]')
        ?.getAttribute('mount-count')
    ).not.to.equal(2)
    expect((console.error as SinonSpy).calledOnce).to.equal(true)
  })
  describe("shouldn't unmount style when mount option.count = false and unmount options.count is true", () => {
    it('#case1', () => {
      style.mount({ id: '14144', count: false })
      style.unmount({ id: '14144', count: true })
      expect(document.head.querySelector('[cssr-id="14144"]')).not.to.equal(
        null
      )
    })
  })
})

describe('# unmount with delay', () => {
  const style = c('.red-block', {
    backgroundColor: 'red'
  })
  beforeEach(() => {
    spy(console, 'error')
  })
  afterEach(() => {
    (console.error as SinonSpy).restore()
  })
  it('should delay unmount when delay is set', function (done) {
    style.mount({
      id: '14138',
      count: true
    })
    style.unmount({
      id: '14138',
      count: true,
      delay: 100
    })
    expect(document.head.querySelector('[cssr-id="14138"]')).not.to.equal(null)
    setTimeout(() => {
      expect(document.head.querySelector('[cssr-id="14138"]')).to.equal(null)
      done()
    }, 200)
  })
  it('should keep element if mount before unmount fired', function (done) {
    style.mount({
      id: '14138',
      count: true
    })
    style.unmount({
      id: '14138',
      count: true,
      delay: 133
    })
    setTimeout(() => {
      style.mount({
        id: '14138',
        count: true
      })
    }, 67)
    setTimeout(() => {
      expect(document.head.querySelector('[cssr-id="14138"]')).not.to.equal(
        null
      )
      done()
    }, 200)
  })
})

describe('unmount with delay', () => {
  const style = c('.red-block', {
    backgroundColor: 'red'
  })
  it('unmount with delay', (done) => {
    style.mount({ id: 'delay' })
    expect(document.querySelectorAll('[cssr-id=delay]').length).to.eq(1)
    style.unmount({ id: 'delay', delay: 300 })
    expect(document.querySelectorAll('[cssr-id=delay]').length).to.eq(1)
    setTimeout(() => {
      expect(document.querySelectorAll('[cssr-id=delay]').length).to.eq(0)
      done()
    }, 400)
  })
})

describe('mix count or no-count when calling mount & unmount', () => {
  const style = c('.red-block', {
    backgroundColor: 'red'
  })
  beforeEach(() => {
    spy(console, 'error')
  })
  afterEach(() => {
    (console.error as SinonSpy).restore()
    style.unmount()
  })
  it('mount true unmount false', () => {
    style.mount({ id: '07akioni', count: true })
    style.unmount({ id: '07akioni' })
    expect(document.head.querySelector('[cssr-id="07akioni"]')).not.to.equal(
      null
    )
    expect(
      document.head
        .querySelector('[cssr-id="07akioni"]')
        ?.getAttribute('mount-count')
    ).to.eq('1')
    expect(style.els.length).to.eq(1)
    expect((console.error as SinonSpy).called).to.eq(true)
  })
  it('mount true mount false', () => {
    style.mount({ id: '07akioni', count: true })
    style.mount({ id: '07akioni' })
    expect(document.head.querySelector('[cssr-id="07akioni"]')).not.to.equal(
      null
    )
    expect(
      document.head
        .querySelector('[cssr-id="07akioni"]')
        ?.getAttribute('mount-count')
    ).to.eq('1')
    expect(style.els.length).to.eq(1)
    expect((console.error as SinonSpy).called).to.eq(true)
  })
  it('mount false mount true', () => {
    style.mount({ id: '07akioni' })
    style.mount({ id: '07akioni', count: true })
    expect(document.head.querySelector('[cssr-id="07akioni"]')).not.to.equal(
      null
    )
    expect(
      document.head
        .querySelector('[cssr-id="07akioni"]')
        ?.getAttribute('mount-count')
    ).to.eq(null)
    expect(style.els.length).to.eq(1)
    expect((console.error as SinonSpy).called).to.eq(true)
  })
})

describe('head', () => {
  const oldStyle = document.createElement('style')
  oldStyle.textContent = '.old-style { color: red; }'
  document.head.appendChild(oldStyle)
  const style = c('.old-style', 'color: blue;')
  const el = document.createElement('div')
  el.classList.add('old-style')
  document.body.appendChild(el)
  it("doesn't affect old style when mount with `head`", () => {
    style.mount({ id: 'head-test-head', head: true })
    expect(getComputedStyle(document.querySelector('.old-style')!).color).to.eq(
      'rgb(255, 0, 0)'
    )
    style.mount({ id: 'head-test-no-head' })
    expect(getComputedStyle(document.querySelector('.old-style')!).color).to.eq(
      'rgb(0, 0, 255)'
    )
  })
})

describe('boost mode', () => {
  it('works in boost mode', () => {
    const divA = document.createElement('div')
    const divB = document.createElement('div')
    divA.classList.add('a')
    divB.classList.add('b')
    divA.appendChild(divB)
    document.body.appendChild(divA)
    const style = c([
      c(
        '.a',
        {
          color: 'red'
        },
        [
          c('.b', {
            color: 'rgb(0, 255, 0)'
          })
        ]
      )
    ])

    style.mount({
      id: 'ab',
      boost: true
    })

    expect(getComputedStyle(document.querySelector('.a')!).color).to.equal(
      'rgb(255, 0, 0)'
    )
    expect(getComputedStyle(document.querySelector('.b')!).color).to.equal(
      'rgb(0, 255, 0)'
    )
  })
})
