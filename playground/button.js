const { CSSRender } = require('css-render')
const { plugin } = require('@css-render/plugin-bem')

const cssr = CSSRender()
const bemPlugin = plugin({
  blockPrefix: '.n-'
})
const { h } = cssr
cssr.use(bemPlugin)
const {
  hB, hE, hM, hNotM
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

function buttonSizeMixin (size) {
  const bs = buttonSize[size]
  return (
    hM(size + '-size', {
      borderRadius: bs,
      fontSize: bs,
      whiteSpace: 'nowrap'
    }, [
      hNotM('text', {
        height: bs,
        lineHeight: bs,
        padding: bs
      }),
      hM('round', {
        padding: bs,
        borderRadius: bs
      }),
      hM('circle', {
        width: bs,
        borderRadius: bs,
        padding: '0 !important'
      }),
      hM('text', {
        padding: 0,
        borderRadius: 0
      }, [
        hE('icon', {
          height: bs,
          lineHeight: bs
        })
      ]),
      hE('content', {
        display: 'inline-block',
        lineHeight: 'inherit'
      }),
      hE('icon', {
        display: 'inline-block',
        position: 'relative',
        lineHeight: bs,
        height: bs,
        width: bs,
        maxWidth: bs,
        verticalAlign: 'bottom'
      }, [
        hB('icon', {
          fontSize: bs
        }),
        hB('base-loading', {
          height: bs,
          width: bs,
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'block'
        }),
        hM('slot', {
          width: bs,
          fontSize: bs,
          display: 'inline-block',
          alignItems: 'center',
          verticalAlign: 'bottom'
        }, [
          hB('icon-slot', {
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
  const borderMaskMixin = hE('border-mask', {
    ...boxShadowStyle
  })
  const iconMixin = hE('icon', [
    hB('icon', {
      fill: bt,
      stroke: bt
    }),
    hB('base-loading', {
      fill: bt,
      stroke: bt
    })
  ])
  return hM(type + '-type', {
    ...borderStyle,
    ...commonStyle
  }, [
    hM('ghost, text', [
      hNotM('disabled', [
        hM('enter-pressed', {
          ...commonStyle
        }, [
          borderMaskMixin,
          iconMixin
        ]),
        h('&:not(:active):focus', [
          hNotM('enter-pressed', {
            ...commonStyle
          }, [
            borderMaskMixin,
            iconMixin
          ])
        ]),
        hNotM('enter-pressed', [
          h('&:hover', {
            ...commonStyle
          }, [
            borderMaskMixin,
            iconMixin
          ]),
          h('&:active', {
            ...commonStyle
          }, [
            borderMaskMixin,
            iconMixin
          ])
        ])
      ]),
      iconMixin
    ]),
    hM('text', {
      border: 'none',
      ...commonStyle
    }, [
      borderMaskMixin,
      hNotM('disabled', [
        hM('rippling', [
          h('&::after', {
            display: 'none'
          })
        ]),
        hM('enter-pressed', {
          ...commonStyle
        }),
        h('&:not(:active):focus', [
          hNotM('enter-pressed', {
            ...commonStyle
          })
        ]),
        hNotM('enter-pressed', [
          h('&:hover', {
            ...commonStyle
          }),
          h('&:active', {
            ...commonStyle
          })
        ])
      ])
    ]),
    iconMixin,
    hNotM('disabled', [
      hM('enter-pressed', {
        ...commonStyle
      }, [
        borderMaskMixin,
        iconMixin
      ]),
      hM('rippling', [
        h('&::after', {
          zIndex: 1,
          animationName: bt,
          animationDuration: bt,
          animationTimingFunction: bt
        }),
        h('&:not(:active):focus', [
          hNotM('enter-pressed', {
            ...commonStyle
          }, [
            borderMaskMixin,
            iconMixin
          ])
        ]),
        hNotM('enter-pressed', [
          h('&:hover', {
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
    h(`@keyframes ${type}-button-ripple--spread`, {
      from: { boxShadow: bt },
      to: { boxShadow: bt }
    }),
    h(`@keyframes ${type}-button-ripple--opacity`, {
      from: { opacity: 0.4 },
      to: { opacity: 0 }
    })
  ]
}

const {
  performance
} = require('perf_hooks')

const start = performance.now()

/** ripple */
const rippleStyle = Object.keys(buttonType).map(type => {
  return buttonRippleMixin(type).map(style => {
    return style.render()
  }).join('\n')
}).join('\n')

/** button */
const buttonStyle = hB('button', {
  boxSizing: 'border-box',
  outline: 'none',
  position: 'relative',
  zIndex: 'auto',
  fontFamily: 'inherit',
  display: 'inline-block',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  textAlign: 'center',
  transition: `
    background-color .3s ease-in-out,
    opacity .3s ease-in-out,
    border-color .3s ease-in-out
  `,
  cursor: 'pointer'
}, [
  h('&::after', {
    pointerEvents: 'none',
    content: '\'\'',
    borderRadius: 'inherit',
    position: 'absolute',
    left: '-1px',
    top: '-1px',
    right: '-1px',
    bottom: '-1px'
  }),
  hE('border-mask', {
    position: 'absolute',
    left: '-1px',
    top: '-1px',
    right: '-1px',
    bottom: '-1px',
    borderRadius: 'inherit',
    boxShadow: 'inset 0 0 0 1px transparent',
    transition: 'box-shadow .3s $--n-ease-in-out-cubic-bezier',
    pointerEvents: 'none',
    zIndex: 1
  }),
  hE('icon', {
    transition: 'color .3s $--n-ease-in-out-cubic-bezier'
  }),
  hE('content', {
    whiteSpace: 'nowrap',
    transition: 'color .3s $--n-ease-in-out-cubic-bezier'
  }),
  hM('left-icon', [
    hE('icon', {
      marginRight: '6px'
    })
  ]),
  hM('right-icon', [
    hE('icon', {
      marginLeft: '6px'
    })
  ]),
  hM('block', {
    display: 'block',
    width: '100%'
  }),
  hM('loading', {
    display: 'block',
    width: '100%'
  }),
  hM('disabled', {
    cursor: 'not-allowed'
  }),
  h('&::-moz-focus-inner', {
    border: 0
  }),
  buttonSizeMixin('small'),
  buttonSizeMixin('medium'),
  buttonSizeMixin('large'),
  ...Object.keys(buttonType).map(type => buttonTypeMixin(type))
]).render()

const buttonGroupStyle = hB('button-group', {
  whiteSpace: 'nowrap',
  display: 'inline-block',
  position: 'relative'
}, [
  hNotM('vertical', {
    display: 'flex',
    flexWrap: 'nowrap'
  }, [
    hE('button', {
      flexGrow: 1
    }),
    hB('button', [
      h('&:first-child:not(:last-child)', {
        marginRight: '0 !important',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
      }),
      h('&:last-child:not(:first-child)', {
        marginLeft: '0 !important',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
      }),
      h('&:not(first-child):not(:last-child)', {
        marginLeft: '0 !important',
        marginRight: '0 !important',
        borderRadius: '0 !important'
      }),
      hM('default-type', [
        h('& +', [
          hB('button', [
            hM('default-type', {
              borderLeftWidth: 0
            })
          ])
        ])
      ]),
      hM('ghost', [
        ...[
          'primary',
          'info',
          'success',
          'warning',
          'error'
        ].map(v => hM(v + '-type', [
          h('& +', [
            hB('button', [
              hM('default-type', {
                borderLeftWidth: 0
              })
            ])
          ])
        ]))
      ])
    ])
  ]),
  hM('vertical', {
    display: 'inline-flex',
    flexDirection: 'column'
  }, [
    hB('button', [
      h('&:first-child:not(:last-child)', {
        marginBottom: '0 !important',
        marginLeft: '0 !important',
        marginRight: '0 !important',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
      }),
      h('&:last-child:not(:first-child)', {
        marginTop: '0 !important',
        marginLeft: '0 !important',
        marginRight: '0 !important',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
      }),
      h('&:not(first-child):not(:last-child)', {
        margin: '0 !important',
        borderRadius: '0 !important'
      }),
      hM('default-type', [
        h('& +', [
          hB('button', [
            hM('default-type', {
              borderTopWidth: 0
            })
          ])
        ])
      ]),
      hM('ghost', [
        ...[
          'primary',
          'info',
          'success',
          'warning',
          'error'
        ].map(v => hM(v + '-type', [
          h('& +', [
            hB('button', [
              hM('default-type', {
                borderTopWidth: 0
              })
            ])
          ])
        ]))
      ])
    ])
  ])
]).render()

const end = performance.now()

// console.log(rippleStyle)
// console.log(buttonStyle)
// console.log(buttonGroupStyle)
console.log(end - start)
