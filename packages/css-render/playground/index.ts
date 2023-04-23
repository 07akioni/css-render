import { CssRender } from '../src/index'

const { c } = CssRender()

const style = c([
  c('.a', {
    color: 'red'
  }, [
    c('.b', {
      color: 'green'
    })
  ])
])

style.mount({
  id: 'ab'
})
