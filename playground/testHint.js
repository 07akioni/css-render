const { CssRender } = require('css-render')
const { plugin } = require('@css-render/plugin-bem')

const cssr = CssRender()
const bemPlugin = plugin({
  blockPrefix: '.n-'
})
const { c } = cssr
cssr.use(bemPlugin)
const {
  cB, cE, cM, cNotM
} = bemPlugin

const style = c('selector', {
  background: 'black',
  from: {
    background: 'black'
  }
}, [
  c('selector2', {
    background: 'black',
    from: {
      background: 'black'
    }
  })
])

const style2 = c('selector', ({
  context,
  props
}) => {
  return {
    x: ''
  }
})

const target = style.mount({
  target: '123'
})

style.render({
  cool: 'good'
})
