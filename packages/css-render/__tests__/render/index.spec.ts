import CssRender from '../../src'
import { assertEqual } from '@css-render/test-shared'

const {
  c,
  config
} = CssRender()

describe('#render - common cases', () => {
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
    `pfxbody.dark {
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
    `pfxbody.dark {
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
  it('should preserve empty block when keepEmptyBlock is false', () => {
    config.keepEmptyBlock = true
    assertEqual(
      c('body', {}).render(),
      'body {}'
    )
    config.keepEmptyBlock = false
    assertEqual(
      c('body', {}).render(),
      ''
    )
    config.keepEmptyBlock = true
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
    assertEqual(
      c('body', {
        color: 'black'
      }, [
        c({}, {
          background: 'red'
        })
      ]).render(),
      `
      body {
        color: black;
      }

      body {
        background: red;
      }
      `
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

describe('#render - doc cases', () => {
  it('#case1', () => {
    assertEqual(
      c('.button', {
        color: 'black'
      }, [
        c('.button__icon', {
          fill: 'black'
        }),
        c('&.button--error', {
          color: 'red'
        })
      ]).render(),
      `
      .button {
        color: black;
      }

      .button .button__icon {
        fill: black;
      }

      .button.button--error {
        color: red;
      }
      `
    )
  })
  it('#case2', () => {
    assertEqual(c(({
      context,
      props
    }) => props.selector, {
      color: 'black'
    }).render({
      selector: '.selector'
    }),
    `
    .selector {
      color: black;
    }
    `)
  })
  it('#case3', () => {
    assertEqual(c('div', [
      c(null, [
        c('button', {
          color: 'black'
        })
      ])
    ]).render(),
    `
    div button {
      color: black;
    }
    `)
  })
  it('#case3', () => {
    assertEqual(c('div', [
      ({ context, props }) => c('button', {
        color: props.color
      }),
      c('ul', {
        backgroundColor: 'red'
      }),
      [
        [c('dl', {
          backgroundColor: 'red'
        })]
      ],
      () => [
        c('ol', {
          backgroundColor: 'red'
        })
      ]
    ]).render({
      color: 'black'
    }),
    `div button {
      color: black;
    }

    div ul {
      background-color: red;
    }

    div dl {
      background-color: red;
    }

    div ol {
      background-color: red;
    }`)
  })
})

describe('#render - falsy node', () => {
  it('#case1', () => {
    assertEqual(
      c('.button', {
        color: 'black'
      }, [
        null,
        undefined,
        () => null,
        () => undefined,
        c('.button__icon', {
          fill: 'black'
        }),
        c('&.button--error', {
          color: 'red'
        })
      ]).render(),
      `
      .button {
        color: black;
      }

      .button .button__icon {
        fill: black;
      }

      .button.button--error {
        color: red;
      }
      `
    )
  })
})

describe('#render - string property', () => {
  it('#case1', () => {
    assertEqual(c('x', '666').render(), `x { 666 }`)
  })
  it('#case2', () => {
    assertEqual(c('x', 'color: red;').render(), `x { color: red; }`)
  })
  it('#case3', () => {
    assertEqual(c('x', () => '666').render(), `x { 666 }`)
  })
  it('#case4', () => {
    assertEqual(c('x', () => 'color: red;').render(), `x { color: red; }`)
  })
})

describe('#render - raw property', () => {
  it('#case1', () => {
    assertEqual(c('x', {
      raw: '666'
    }).render(), `
    x {
    666
    }
    `)
    assertEqual(c('x', {
      raw: '666',
      color: 'white'
    }).render(), `
    x {
    666
    color: white;
    }
    `)
  })
})

describe('#render - string child', () => {
  it('#case 1', () => {
    assertEqual(c([
      'good { key: value }'
    ]).render(),
    'good { key: value }'
    )
  })
  it('#case 2', () => {
    assertEqual(c('parent', [
      c('gogogo', { key: 'value' }),
      'key: value;'
    ]).render(),
    `
      parent gogogo { key: value; }
      parent { key: value; }
    `
    )
  })
})
