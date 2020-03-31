const { CSSRender } = require('../packages/core/dist')
const { plugin } = require('../packages/plugins/bem/dist')

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

Object.keys(buttonType).forEach(type => {
  buttonRippleMixin(type).forEach(style => {
    console.log(style.render())
  })
})

console.log(hB('button', [
  buttonSizeMixin('small'),
  buttonSizeMixin('medium'),
  buttonSizeMixin('large'),
  ...Object.keys(buttonType).map(type => buttonTypeMixin(type))
]).render())
