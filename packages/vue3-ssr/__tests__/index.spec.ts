import { CssRender } from 'css-render'
import { h, createSSRApp, defineComponent } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { ssrAdapter, setup } from '../src/index'

const { c } = CssRender()

describe('ssr', () => {
  const Child = defineComponent({
    setup () {
      c('div', {
        color: 'red'
      }).mount({
        id: 'mount-id',
        ssr: ssrAdapter
      })
    },
    render () {
      return h('div', null, 'Child')
    }
  })
  const App = defineComponent({
    render () {
      return h(Child)
    }
  })
  const app = createSSRApp(App)
  const { collect } = setup(app)
  it('should work', (done) => {
    renderToString(app).then((v) => {
      expect(collect() + v).toMatchSnapshot()
      done()
    })
  })
})
