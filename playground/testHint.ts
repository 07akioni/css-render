import CSSRender from 'css-render'

const cssr = CSSRender()
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
