import { CSSRender } from '@css-render/core/index'
import { assertEqual } from '@css-render/shared/utils'
import CSSRenderBEMPlugin from '@css-render/plugins/bem/index'

const cssr = CSSRender()
const plugin = CSSRenderBEMPlugin({
  blockPrefix: '.c-'
})
cssr.use(plugin)

const {
  h,
  render
} = cssr

const {
  b
} = plugin

describe('# bem.b', function () {
  it('should use blockPrefix', function () {
    assertEqual(
      render(h(b('block'), { k: 'v' })),
      '.c-block { k: v; }'
    )
  })
  it('should generate correct selector when nested', function () {
    assertEqual(
      render(
        h(
          b('block'),
          [h(b('block2'), { k: 'v' })]
        )
      ),
      '.c-block .c-block2 { k: v; }'
    )
  })
})
