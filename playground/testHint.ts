import CssRender from 'css-render'

const cssr = CssRender()
const { c } = cssr

const target = c('selector', {
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
]).mount({
  target: null
})
