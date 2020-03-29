import { h, context, render } from '@css-render/core/index'
import { isSame } from './utils'
import { setup, b } from '@css-render/plugins/bem/index'

describe('# bem.b', function () {
  this.beforeAll(function () {
    setup(context, {
      blockPrefix: '.c-'
    })
  })
  it('should use blockPrefix', function () {
    isSame(
      render(h(b('block'), { k: 'v' })),
      '.c-block { k: v; }'
    ).to.equal(true)
  })
  it('should generate correct selector when nested', function () {
    isSame(
      render(
        h(
          b('block'),
          [h(b('block2'), { k: 'v' })]
        )
      ),
      '.c-block .c-block2 { k: v; }'
    ).to.equal(true)
  })
})
