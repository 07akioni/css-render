/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as chai from 'chai'
import CssRender, { exists } from '../../src'
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

describe('# mount & unmount with id (suite 1)', () => {
  const style = c('.red-block', {
    backgroundColor: 'red'
  })
  before(() => {
    style.mount({
      id: 'test-id-1'
    })
    style.mount({
      id: 'test-id-2'
    })
    style.mount({
      id: '14138'
    })
    style.mount({
      id: '14139'
    })
  })
  beforeEach(() => {
    spy(console, 'error')
  })
  afterEach(() => {
    (console.error as SinonSpy).restore()
  })
  it('should work in no-count mode', () => {
    expect(exists('jjy')).to.eq(false)
    style.mount({ id: 'jjy' })
    expect(exists('jjy')).to.eq(true)
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
      id: 'test-id-1'
    })
    style.unmount({
      id: '14138'
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
  after(() => {
    style.unmount()
  })
})

describe('# mount & unmount with id (suite 2)', function () {
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
  it('should mount same element with same id', function () {
    const el = style.mount({
      id: '14141'
    })
    const el2 = style.mount({
      id: '14141'
    })
    expect(el).to.equal(el2)
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

describe('slient mode', () => {
  it('works in slient mode', () => {
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
      slient: true
    })

    expect(getComputedStyle(document.querySelector('.a')!).color).to.equal(
      'rgb(255, 0, 0)'
    )
    expect(getComputedStyle(document.querySelector('.b')!).color).to.equal(
      'rgb(0, 255, 0)'
    )
  })
})

describe('force', () => {
  it('works', () => {
    const divA = document.createElement('div')
    divA.classList.add('a')
    const style = c('.a', ({ props }) => ({
      color: props.color
    }))
    style.mount({
      id: 'force',
      props: {
        color: 'red'
      },
      force: true
    })
    expect(getComputedStyle(document.querySelector('.a')!).color).to.equal(
      'rgb(255, 0, 0)'
    )
    style.mount({
      id: 'force',
      props: {
        color: 'rgb(0, 255, 0)'
      },
      force: true
    })
    expect(getComputedStyle(document.querySelector('.a')!).color).to.equal(
      'rgb(0, 255, 0)'
    )
  })
})
