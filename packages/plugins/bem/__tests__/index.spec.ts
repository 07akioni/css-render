import CssRender from 'css-render'
import { assertEqual } from '@css-render/shared/utils'
import CssRenderBEMPlugin from '@css-render/plugins/bem/index'

const cssr = CssRender({
  keepEmptyBlock: true
})
const plugin = CssRenderBEMPlugin({
  blockPrefix: '.c-',
  elementPrefix: '__',
  modifierPrefix: '--'
})
cssr.use(plugin)

const { c } = cssr

const {
  cB,
  cE,
  cM,
  cNotM
} = plugin

describe('default prefixes', function () {
  it('should use default prefixes', function () {
    const plugin = CssRenderBEMPlugin({})
    cssr.use(plugin)
    const {
      cB,
      cE,
      cM,
      cNotM
    } = plugin
    assertEqual(
      cB('b', [
        cM('m', {}),
        cNotM('nm', {}),
        cE('e', [
          cM('m', {}),
          cNotM('nm', {})
        ])
      ]).render(),
      `
      .b.b--m {}
      .b:not(.b--nm) {}
      .b .b__e.b__e--m {}
      .b .b__e:not(.b__e--nm) {}
      `
    )
  })
  it('should use default prefixes', function () {
    const plugin = CssRenderBEMPlugin()
    cssr.use(plugin)
    const {
      cB,
      cE,
      cM,
      cNotM
    } = plugin
    assertEqual(
      cB('b', [
        cM('m', {}),
        cNotM('nm', {}),
        cE('e', [
          cM('m', {}),
          cNotM('nm', {})
        ])
      ]).render(),
      `
      .b.b--m {}
      .b:not(.b--nm) {}
      .b .b__e.b__e--m {}
      .b .b__e:not(.b__e--nm) {}
      `
    )
  })
})

describe('# bem.b', function () {
  it('should use blockPrefix', function () {
    assertEqual(
      cB('b', {}).render(),
      '.c-b {}'
    )
  })
  it('should generate correct selector when nested', function () {
    assertEqual(
      cB(
        'b',
        [cB('b2', {})]
      ).render(),
      '.c-b .c-b2 {}'
    )
  })
})

describe('# bem.e', function () {
  it('should work with bem.b', function () {
    assertEqual(
      cB('b', [cE('e', {})]).render(),
      '.c-b .c-b__e {}'
    )
  })
  it('should work with comma selector', function () {
    assertEqual(
      cB('b', [cE('e1, e2', {})]).render(),
      '.c-b .c-b__e1, .c-b .c-b__e2 {}'
    )
  })
  it('should work with nested e', function () {
    assertEqual(
      cB('b', [
        cE('e1', {}, [
          cM('m1', {}),
          cE('e2', {}, [
            cM('m2', {})
          ])
        ])
      ]).render(),
      `
      .c-b .c-b__e1 {}
      .c-b .c-b__e1.c-b__e1--m1 {}
      .c-b .c-b__e1 .c-b__e2 {}
      .c-b .c-b__e1 .c-b__e2.c-b__e2--m2 {}
      `
    )
    assertEqual(
      cB('b', [
        cE('e1', [
          c('& +', [
            cE('e2', [
              cM('m2', {})
            ])
          ])
        ])
      ]).render(),
      `
      .c-b .c-b__e1 + .c-b__e2.c-b__e2--m2 {}
      `
    )
  })
})

describe('# bem.m', function () {
  it('should work with bem.b', function () {
    assertEqual(
      cB('b', [cM('m', {})]).render(),
      '.c-b.c-b--m {}'
    )
  })
  it('should work with bem.e', function () {
    assertEqual(
      cB('b', [cE('e', [cM('m', {})])]).render(),
      '.c-b .c-b__e.c-b__e--m {}'
    )
  })
  it('should work with comma selector', function () {
    assertEqual(
      cB('b', [cM('m1, m2', {})]).render(),
      '.c-b.c-b--m1, .c-b.c-b--m2 {}'
    )
    assertEqual(
      cB('b', [cE('e', [cM('m1, m2', {})])]).render(),
      '.c-b .c-b__e.c-b__e--m1, .c-b .c-b__e.c-b__e--m2 {}'
    )
  })
})

describe('# bem.notM', function () {
  it('should work with bem.b', function () {
    assertEqual(
      cB('b', [cNotM('m', {})]).render(),
      '.c-b:not(.c-b--m) {}'
    )
  })
  it('should work with bem.e', function () {
    assertEqual(
      cB('b', [cE('e', [cNotM('m', {})])]).render(),
      '.c-b .c-b__e:not(.c-b__e--m) {}'
    )
  })
})

describe('# bem', function () {
  it('should pass test case#1', function () {
    assertEqual(
      cB(
        'container',
        [
          cE(
            'left, right',
            {
              width: '50%'
            }
          ),
          cM(
            'dark',
            [
              cE(
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

describe('# function typed selector', function () {
  it('should pass test case#1', function () {
    assertEqual(
      cB(({ props }) => props.value as string + 'block', {
        key: 'value'
      }, [
        cE(({ props }) => props.value as string + 'el', {
          key: 'value'
        }, [
          cM(({ props }) => props.value as string + 'm', {
            key: 'value'
          }),
          cNotM(({ props }) => props.value as string + 'nm', {
            key: 'value'
          })
        ])
      ]).render({
        value: 'propValue'
      }),
    `
    .c-propValueblock {
      key: value;
    }

    .c-propValueblock .c-propValueblock__propValueel {
      key: value;
    }

    .c-propValueblock .c-propValueblock__propValueel.c-propValueblock__propValueel--propValuem {
      key: value;
    }

    .c-propValueblock .c-propValueblock__propValueel:not(.c-propValueblock__propValueel--propValuenm) {
      key: value;
    }
    `)
  })
})

describe('error info', () => {
  describe('shouldn\'t allow using modifier inside multiple elements', () => {
    it('#case m', (done) => {
      try {
        cB('b', [cE('e, e', [cM('m', {})])]).render()
      } catch (e) {
        done()
      }
    })
    it('#case not m', (done) => {
      try {
        cB('b', [cE('e, e', [cNotM('m', {})])]).render()
      } catch (e) {
        done()
      }
    })
  })
})
