import CSSRender from '@css-render/core/index'
import { assertEqual } from '@css-render/shared/utils'
import CSSRenderBEMPlugin from '@css-render/plugins/bem/index'

const cssr = CSSRender({
  preserveEmptyBlock: true
})
const plugin = CSSRenderBEMPlugin({
  blockPrefix: '.c-',
  elementPrefix: '__',
  modifierPrefix: '--'
})
cssr.use(plugin)

const {
  hB,
  hE,
  hM,
  hNotM
} = plugin

describe('# bem.b', function () {
  it('should use blockPrefix', function () {
    assertEqual(
      hB('b', {}).render(),
      '.c-b {}'
    )
  })
  it('should generate correct selector when nested', function () {
    assertEqual(
      hB(
        'b',
        [hB('b2', {})]
      ).render(),
      '.c-b .c-b2 {}'
    )
  })
})

describe('# bem.e', function () {
  it('should work with bem.b', function () {
    assertEqual(
      hB('b', [hE('e', {})]).render(),
      '.c-b .c-b__e {}'
    )
  })
  it('should work with comma selector', function () {
    assertEqual(
      hB('b', [hE('e1, e2', {})]).render(),
      '.c-b .c-b__e1, .c-b .c-b__e2 {}'
    )
  })
})

describe('# bem.m', function () {
  it('should work with bem.b', function () {
    assertEqual(
      hB('b', [hM('m', {})]).render(),
      '.c-b.c-b--m {}'
    )
  })
  it('should work with bem.e', function () {
    assertEqual(
      hB('b', [hE('e', [hM('m', {})])]).render(),
      '.c-b .c-b__e.c-b__e--m {}'
    )
  })
  it('should work with comma selector', function () {
    assertEqual(
      hB('b', [hM('m1, m2', {})]).render(),
      '.c-b.c-b--m1, .c-b.c-b--m2 {}'
    )
    assertEqual(
      hB('b', [hE('e', [hM('m1, m2', {})])]).render(),
      '.c-b .c-b__e.c-b__e--m1, .c-b .c-b__e.c-b__e--m2 {}'
    )
  })
})

describe('# bem.notM', function () {
  it('should work with bem.b', function () {
    assertEqual(
      hB('b', [hNotM('m', {})]).render(),
      '.c-b:not(.c-b--m) {}'
    )
  })
  it('should work with bem.e', function () {
    assertEqual(
      hB('b', [hE('e', [hNotM('m', {})])]).render(),
      '.c-b .c-b__e:not(.c-b__e--m) {}'
    )
  })
})

describe('# bem', function () {
  it('should pass test case#1', function () {
    assertEqual(
      hB(
        'container',
        [
          hE(
            'left, right',
            {
              width: '50%'
            }
          ),
          hM(
            'dark',
            [
              hE(
                'left, right',
                {
                  backgroundColor: 'black'
                }
              )
            ]
          )
        ]
      ).render(),
      `.c-container .c-container__left, .c-container .c-container__right {
        width: 50%;
      }
      
      .c-container.c-container--dark .c-container__left,
      .c-container.c-container--dark .c-container__right {
        background-color: black;
      }`
    )
  })
})
