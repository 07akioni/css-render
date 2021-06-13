import { CssRender } from 'css-render'
import { h, createSSRApp, defineComponent } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { useSsrAdapter, setup } from '../src/index'

const { c } = CssRender()

describe('ssr', () => {
  describe('render to string', () => {
    const Child = defineComponent({
      setup () {
        c('div', {
          color: 'red'
        }).mount({
          id: 'mount-id',
          ssr: useSsrAdapter()
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
  describe('useSsrAdapter', () => {
    const Child = defineComponent({
      setup () {
        c('div', {
          color: 'red'
        }).mount({
          id: 'mount-id',
          ssr: useSsrAdapter()
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
  // uncomment after vue fixes the stream ssr bug
  // describe('render to stream', () => {
  //   it('should work', (done) => {
  //     const app = createSSRApp({
  //       render () {
  //         return [
  //           h(Foo),
  //           h(Suspense, null, {
  //             default: () => h(Bar),
  //             ssFallback: () => 'suspense'
  //           }),
  //           h(Foo)
  //         ]
  //       }
  //     })
  //     const Foo = {
  //       setup () {
  //         c('div', {
  //           color: 'foo'
  //         }).mount({
  //           id: 'foo',
  //           ssr: ssrAdapter
  //         })
  //       },
  //       render: () => h('div', 'foo')
  //     }
  //     const Bar = {
  //       async setup () {
  //         c('div', {
  //           color: 'bar'
  //         }).mount({
  //           id: 'bar',
  //           ssr: ssrAdapter
  //         })
  //         await new Promise((resolve) => setTimeout(resolve, 1000))
  //       },
  //       render: () => {
  //         return [h('div', 'bar'), h(Foo)]
  //       }
  //     }
  //     const { collect } = setup(app)
  //     const rs = renderToStream(app)
  //     let html = ''
  //     rs.on('data', (chunk) => {
  //       html += `${collect()}\n${chunk.toString() as string}`
  //     })
  //     rs.on('end', () => {
  //       expect(html).toMatchSnapshot()
  //       done()
  //     })
  //   })
  // })
})
