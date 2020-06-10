const { CSSRender } = require('css-render')
const { plugin } = require('@css-render/plugin-bem')

const cssr = CSSRender()
const bemPlugin = plugin({
  blockPrefix: '.n-'
})
const { c } = cssr
cssr.use(bemPlugin)
const {
  cB, cE, cM, cNotM
} = bemPlugin

const buttonType = {
  default: 'default-type',
  primary: 'primary-type',
  info: 'info-type',
  success: 'success-type',
  warning: 'warning-type',
  error: 'error-type'
}

const buttonSize = {
  small: 'small-size',
  medium: 'medium-size',
  large: 'large-size'
}

const {
  performance
} = require('perf_hooks')

const start = performance.now()

function buttonSizeMixin (size) {
  const bs = buttonSize[size]
  return (
    cM(size + '-size', {
      borderRadius: bs,
      fontSize: bs,
      whiteSpace: 'nowrap'
    }, [
      cNotM('text', {
        height: bs,
        lineHeight: bs,
        padding: bs
      }),
      cM('round', {
        padding: bs,
        borderRadius: bs
      }),
      cM('circle', {
        width: bs,
        borderRadius: bs,
        padding: '0 !important'
      }),
      cM('text', {
        padding: 0,
        borderRadius: 0
      }, [
        cE('icon', {
          height: bs,
          lineHeight: bs
        })
      ]),
      cE('content', {
        display: 'inline-block',
        lineHeight: 'inherit'
      }),
      cE('icon', {
        display: 'inline-block',
        position: 'relative',
        lineHeight: bs,
        height: bs,
        width: bs,
        maxWidth: bs,
        verticalAlign: 'bottom'
      }, [
        cB('icon', {
          fontSize: bs
        }),
        cB('base-loading', {
          height: bs,
          width: bs,
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'block'
        }),
        cM('slot', {
          width: bs,
          fontSize: bs,
          display: 'inline-block',
          alignItems: 'center',
          verticalAlign: 'bottom'
        }, [
          cB('icon-slot', {
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'block',
            lineHeight: bs,
            height: bs,
            width: bs,
            fontSize: bs
          })
        ])
      ])
    ])
  )
}

function buttonTypeMixin (type) {
  const bt = buttonType[type]
  const commonStyle = {
    backgroundColor: bt,
    color: bt
  }
  const borderStyle = {
    border: bt
  }
  const boxShadowStyle = {
    boxShadow: bt
  }
  const borderMaskMixin = cE('border-mask', {
    ...boxShadowStyle
  })
  const iconMixin = cE('icon', [
    cB('icon', {
      fill: bt,
      stroke: bt
    }),
    cB('base-loading', {
      fill: bt,
      stroke: bt
    })
  ])
  return cM(type + '-type', {
    ...borderStyle,
    ...commonStyle
  }, [
    cM('ghost, text', [
      cNotM('disabled', [
        cM('enter-pressed', {
          ...commonStyle
        }, [
          borderMaskMixin,
          iconMixin
        ]),
        c('&:not(:active):focus', [
          cNotM('enter-pressed', {
            ...commonStyle
          }, [
            borderMaskMixin,
            iconMixin
          ])
        ]),
        cNotM('enter-pressed', [
          c('&:hover', {
            ...commonStyle
          }, [
            borderMaskMixin,
            iconMixin
          ]),
          c('&:active', {
            ...commonStyle
          }, [
            borderMaskMixin,
            iconMixin
          ])
        ])
      ]),
      iconMixin
    ]),
    cM('text', {
      border: 'none',
      ...commonStyle
    }, [
      borderMaskMixin,
      cNotM('disabled', [
        cM('rippling', [
          c('&::after', {
            display: 'none'
          })
        ]),
        cM('enter-pressed', {
          ...commonStyle
        }),
        c('&:not(:active):focus', [
          cNotM('enter-pressed', {
            ...commonStyle
          })
        ]),
        cNotM('enter-pressed', [
          c('&:hover', {
            ...commonStyle
          }),
          c('&:active', {
            ...commonStyle
          })
        ])
      ])
    ]),
    iconMixin,
    cNotM('disabled', [
      cM('enter-pressed', {
        ...commonStyle
      }, [
        borderMaskMixin,
        iconMixin
      ]),
      cM('rippling', [
        c('&::after', {
          zIndex: 1,
          animationName: bt,
          animationDuration: bt,
          animationTimingFunction: bt
        }),
        c('&:not(:active):focus', [
          cNotM('enter-pressed', {
            ...commonStyle
          }, [
            borderMaskMixin,
            iconMixin
          ])
        ]),
        cNotM('enter-pressed', [
          c('&:hover', {
            ...commonStyle
          }, [
            borderMaskMixin,
            iconMixin
          ])
        ])
      ])
    ])
  ])
}

function buttonRippleMixin (type) {
  const bt = buttonType[type]
  return [
    c(`@keyframes ${type}-button-ripple--spread`, {
      from: { boxShadow: bt },
      to: { boxShadow: bt }
    }),
    c(`@keyframes ${type}-button-ripple--opacity`, {
      from: { opacity: 0.4 },
      to: { opacity: 0 }
    })
  ]
}

/** ripple */
const rippleStyle = Object.keys(buttonType).map(type => {
  return buttonRippleMixin(type)
})

/** button */
const buttonStyle = cB('button', {
  raw: `
    box-sizing: border-box;
    outline: none;
    position: relative;
    z-index: auto;
    font-family: inherit;
    display: inline-block;
    align-items: center;
    justify-content: center;
    user-select: none;
    text-align: center;
    transition: 
      background-color .3s ease-in-out,
      opacity .3s ease-in-out,
      border-color .3s ease-in-out;
    cursor: pointer;
  `
}, [
  c('&::after', {
    raw: `
      pointer-events: none;
      content: "",
      border-radius: inherit;
      position: absolute;
      left: -1px;
      top: -1px;
      right: -1px';
      bottom: -1px;
    `
  }),
  cE('border-mask', {
    raw: `
      position: absolute;
      left: -1px;
      top: -1px;
      right: -1px;
      bottom: -1px;
      border-radius: inherit;
      box-shadow: inset 0 0 0 1px transparent;
      transition: box-shadow .3s $--n-ease-in-out-cubic-bezier;
      pointerEvents: none;
      zIndex: 1;
    `
  }),
  cE('icon', {
    transition: 'color .3s $--n-ease-in-out-cubic-bezier'
  }),
  cE('content', {
    whiteSpace: 'nowrap',
    transition: 'color .3s $--n-ease-in-out-cubic-bezier'
  }),
  cM('left-icon', [
    cE('icon', {
      marginRight: '6px'
    })
  ]),
  cM('right-icon', [
    cE('icon', {
      marginLeft: '6px'
    })
  ]),
  cM('block', {
    display: 'block',
    width: '100%'
  }),
  cM('loading', {
    display: 'block',
    width: '100%'
  }),
  cM('disabled', {
    cursor: 'not-allowed'
  }),
  c('&::-moz-focus-inner', {
    border: 0
  }),
  buttonSizeMixin('tiny'),
  buttonSizeMixin('small'),
  buttonSizeMixin('medium'),
  buttonSizeMixin('large'),
  ...Object.keys(buttonType).map(type => buttonTypeMixin(type))
])

const buttonGroupStyle = cB('button-group', {
  whiteSpace: 'nowrap',
  display: 'inline-block',
  position: 'relative'
}, [
  cNotM('vertical', {
    display: 'flex',
    flexWrap: 'nowrap'
  }, [
    cE('button', {
      flexGrow: 1
    }),
    cB('button', [
      c('&:first-child:not(:last-child)', {
        marginRight: '0 !important',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
      }),
      c('&:last-child:not(:first-child)', {
        marginLeft: '0 !important',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
      }),
      c('&:not(first-child):not(:last-child)', {
        marginLeft: '0 !important',
        marginRight: '0 !important',
        borderRadius: '0 !important'
      }),
      cM('default-type', [
        c('& +', [
          cB('button', [
            cM('default-type', {
              borderLeftWidth: 0
            })
          ])
        ])
      ]),
      cM('ghost', [
        ...[
          'primary',
          'info',
          'success',
          'warning',
          'error'
        ].map(v => cM(v + '-type', [
          c('& +', [
            cB('button', [
              cM('default-type', {
                borderLeftWidth: 0
              })
            ])
          ])
        ]))
      ])
    ])
  ]),
  cM('vertical', {
    display: 'inline-flex',
    flexDirection: 'column'
  }, [
    cB('button', [
      c('&:first-child:not(:last-child)', {
        marginBottom: '0 !important',
        marginLeft: '0 !important',
        marginRight: '0 !important',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
      }),
      c('&:last-child:not(:first-child)', {
        marginTop: '0 !important',
        marginLeft: '0 !important',
        marginRight: '0 !important',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
      }),
      c('&:not(first-child):not(:last-child)', {
        margin: '0 !important',
        borderRadius: '0 !important'
      }),
      cM('default-type', [
        c('& +', [
          cB('button', [
            cM('default-type', {
              borderTopWidth: 0
            })
          ])
        ])
      ]),
      cM('ghost', [
        ...[
          'primary',
          'info',
          'success',
          'warning',
          'error'
        ].map(v => cM(v + '-type', [
          c('& +', [
            cB('button', [
              cM('default-type', {
                borderTopWidth: 0
              })
            ])
          ])
        ]))
      ])
    ])
  ])
])

const output = c([
  rippleStyle,
  buttonStyle,
  buttonGroupStyle
]).render()

const end = performance.now()

// console.log(output)
console.log(end - start)
