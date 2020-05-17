import CSSRender from 'css-render'
import { assertEqual } from '@css-render/shared/utils'

const {
  c,
  config
} = CSSRender()

describe('#render', () => {
  it('should work with nested nodes array', () => {
    assertEqual(
      c('body', {
        margin: 0,
        backgroundColor: 'white'
      }, [
        [
          [
            c('&.dark', {
              backgroundColor: 'black'
            })
          ],
          c('.container', {
            width: '100%'
          })
        ]
      ]).render()
      ,
    `body {
      margin: 0;
      background-color: white;
    }
    
    body.dark {
      background-color: black;
    }
    
    body .container {
      width: 100%;
    }`)
  })
  it('should render as expected(1)', () => {
    assertEqual(
      c('body', {
        margin: 0,
        backgroundColor: 'white'
      }, [
        c('&.dark', {
          backgroundColor: 'black'
        }),
        c('.container', {
          width: '100%'
        })
      ]).render()
      ,
    `body {
      margin: 0;
      background-color: white;
    }
    
    body.dark {
      background-color: black;
    }
    
    body .container {
      width: 100%;
    }`)
  })
  it('should render as expected(2)', () => {
    assertEqual(
      c('body', [
        c('&.dark', {
          backgroundColor: 'black'
        }),
        c('.container', {
          width: '100%'
        })
      ]).render()
      ,
    `body.dark {
      background-color: black;
    }
    
    body .container {
      width: 100%;
    }`)
  })
  it('should render as excepted(3)', () => {
    assertEqual(
      c('@keyframes what-a-good-animation', {
        from: {
          color: 'white',
          backgroundColor: 'black'
        },
        to: {
          color: 'black',
          backgroundColor: 'white'
        }
      }).render(),
      `@keyframes what-a-good-animation {
        from {
          color: white;
          background-color: black;
        }
        to {
          color: black;
          background-color: white;
        }
      }`
    )
  })
  it('should render a function typed prop', () => {
    assertEqual(
      c('@keyframes what-a-good-animation', () => ({
        from: {
          color: 'white',
          backgroundColor: 'black'
        },
        to: {
          color: 'black',
          backgroundColor: 'white'
        }
      })).render(),
      `@keyframes what-a-good-animation {
        from {
          color: white;
          background-color: black;
        }
        to {
          color: black;
          background-color: white;
        }
      }`
    )
  })
  it('should render an array as root', () => {
    assertEqual(
      c([
        c('sel1', {
          position: 'relative'
        }, [
          c('&.sel2', {
            position: 'relative'
          })
        ]),
        c('sel1', {
          position: 'relative'
        }, [
          c('&.sel2', {
            position: 'relative'
          })
        ])
      ]).render(),
      `
      sel1 {
        position: relative;
      }
      sel1.sel2 {
        position: relative;
      }
      sel1 {
        position: relative;
      }
      sel1.sel2 {
        position: relative;
      }
      `
    )
  })
  it('should render with props', () => {
    const style = c('sel1', ({ props }) => {
      return {
        color: props.color
      }
    })
    assertEqual(
      style.render({
        color: 'red'
      }),
      `
      sel1 {
        color: red;
      }
      `
    )
  })
  it('should work with COptionSelector', () => {
    assertEqual(
      c({
        $: 'body'
      }, [
        c({
          $: () => '&.dark'
        }, {
          backgroundColor: 'black'
        }),
        c('.container', {
          width: '100%'
        })
      ]).render()
      ,
    `body.dark {
      background-color: black;
    }
    
    body .container {
      width: 100%;
    }`)
  })
  it('should work with CLazySelector', () => {
    assertEqual(
      c(({ props }) => props.pfx as string + 'body', [
        c(({ props }) => `&.${props.pfx as string}dark`, {
          backgroundColor: 'black'
        }),
        c(() => '.container', {
          width: '100%'
        })
      ]).render({
        pfx: 'pfx'
      })
      ,
    `pfxbody.pfxdark {
      background-color: black;
    }
    
    pfxbody .container {
      width: 100%;
    }`)
  })
  it('should work with function typed children', () => {
    assertEqual(
      c(() => 'body', [({ props }) => [
        c(props.prefix as string + '&.dark', {
          backgroundColor: 'black'
        }),
        c(props.prefix as string + '.container', {
          width: '100%'
        })
      ]]).render({
        prefix: 'pfx'
      })
      ,
    `pfx body.dark {
      background-color: black;
    }
    
    body pfx.container {
      width: 100%;
    }`)
    assertEqual(
      c(() => 'body', [
        ({ props }) => c(props.prefix as string + '&.dark', {
          backgroundColor: 'black'
        }),
        ({ props }) => c(props.prefix as string + '.container', {
          width: '100%'
        })
      ]).render({
        prefix: 'pfx'
      })
      ,
    `pfx body.dark {
      background-color: black;
    }
    
    body pfx.container {
      width: 100%;
    }`)
  })
  it('should work with empty selector', () => {
    assertEqual(
      c('', [c('&.a', {
        background: 'red'
      })]).render(),
      `.a {
        background: red;
      }`
    )
    assertEqual(
      c(() => '', [c('&.a', {
        background: 'red'
      })]).render(),
      `.a {
        background: red;
      }`
    )
    assertEqual(
      c(() => null, [c('&.a', {
        background: 'red'
      })]).render(),
      `.a {
        background: red;
      }`
    )
    assertEqual(
      c({}, [c('&.a', {
        background: 'red'
      })]).render(),
      `.a {
        background: red;
      }`
    )
  })
  it('should preserve empty block when preserveEmptyBlock is false', () => {
    config.preserveEmptyBlock = true
    assertEqual(
      c('body', {}).render(),
      'body {}'
    )
    config.preserveEmptyBlock = false
    assertEqual(
      c('body', {}).render(),
      ''
    )
    config.preserveEmptyBlock = true
  })
  it('shouldn\'t render empty property', () => {
    assertEqual(
      c('body', {
        background: undefined,
        myColor: null
      }).render(),
      'body {}'
    )
  })
  it('should work with empty selector', () => {
    assertEqual(
      c('body', [
        c({}, {
          background: 'red'
        })
      ]).render(),
      `body {
        background: red;
      }`
    )
  })
  it('should work with functional typed option selector.$', () => {
    assertEqual(
      c({
        $: ({ props }) => props.x
      }, {
        background: 'red'
      }).render({
        x: 'body'
      }),
      `body {
        background: red;
      }`
    )
  })
  it('should work with null & void returned props function', () => {
    assertEqual(
      c('body', () => null, [
        c('body2', {})
      ]).render(),
      'body body2 {}'
    )
    assertEqual(
      c('body', () => undefined, [
        c('body2', {})
      ]).render(),
      'body body2 {}'
    )
  })
})
