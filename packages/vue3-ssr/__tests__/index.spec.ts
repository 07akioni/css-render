import { CssRender } from 'css-render'
import { h, createSSRApp, defineComponent } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { SsrContext, ssrAdapter } from '../src/index'

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
      return 'Child'
    }
  })
  const App = defineComponent({
    render () {
      return h(SsrContext, null, {
        default: () => h(Child)
      })
    }
  })
  const app = createSSRApp(App)
  it('should work', (done) => {
    renderToString(app).then(v => {
      expect(v).toMatchSnapshot()
      done()
    })
  })
})
