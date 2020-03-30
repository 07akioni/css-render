import { CSSRender } from '@css-render/core/index'
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
  render
} = cssr

const {
  hB,
  hE,
  hM,
  hNotM
} = plugin

describe('# bem.b', function () {
  it('should use blockPrefix', function () {
    assertEqual(
      render(hB('b', {})),
      '.c-b {}'
    )
  })
  it('should generate correct selector when nested', function () {
    assertEqual(
      render(
        hB(
          'b',
          [hB('b2', {})]
        )
      ),
      '.c-b .c-b2 {}'
    )
  })
})

describe('# bem.e', function () {
  it('should work with bem.b', function () {
    assertEqual(
      render(hB('b', [hE('e', {})])),
      '.c-b .c-b__e {}'
    )
  })
  it('should work with comma selector', function () {
    assertEqual(
      render(hB('b', [hE('e1, e2', {})])),
      '.c-b .c-b__e1, .c-b .c-b__e2 {}'
    )
  })
})

describe('# bem.m', function () {
  it('should work with bem.b', function () {
    assertEqual(
      render(hB('b', [hM('m', {})])),
      '.c-b.c-b--m {}'
    )
  })
  it('should work with bem.e', function () {
    assertEqual(
      render(hB('b', [hE('e', [hM('m', {})])])),
      '.c-b .c-b__e.c-b__e--m {}'
    )
  })
  it('should work with comma selector', function () {
    assertEqual(
      render(hB('b', [hM('m1, m2', {})])),
      '.c-b.c-b--m1, .c-b.c-b--m2 {}'
    )
    assertEqual(
      render(hB('b', [hE('e', [hM('m1, m2', {})])])),
      '.c-b .c-b__e.c-b__e--m1, .c-b .c-b__e.c-b__e--m2 {}'
    )
  })
})

describe('# bem.notM', function () {
  it('should work with bem.b', function () {
    assertEqual(
      render(hB('b', [hNotM('m', {})])),
      '.c-b:not(.c-b--m) {}'
    )
  })
  it('should work with bem.e', function () {
    assertEqual(
      render(hB('b', [hE('e', [hNotM('m', {})])])),
      '.c-b .c-b__e:not(.c-b__e--m) {}'
    )
  })
})
