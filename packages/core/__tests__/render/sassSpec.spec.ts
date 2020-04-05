import CSSRender from 'css-render'
import { assertEqual } from '@css-render/shared/utils'

const {
  c
} = CSSRender()

describe('#render (some compatible cases from sass-spec)', () => {
  it('should render as expected(1)', () => {
    assertEqual(
      c('div', [
        c('span, p, span', {
          color: 'red'
        }),
        c('a.foo.bar.foo', {
          color: 'green'
        }),
        c('&:nth(-3)', {
          color: 'blue'
        })
      ]).render(),
      `
      div span, div p, div span {
        color: red;
      }
      div a.foo.bar.foo {
        color: green;
      }
      div:nth(-3) {
        color: blue;
      } 
      `
    )
  })
  it('should render as expected(2)', () => {
    /**
     * this case is modified, in the original case keyframe block is nested,
     * which doesn't follow CSS spec.
     */
    assertEqual(
      c('@-webkit-keyframes', {
        from: {
          left: '0px',
          whatever: 'hoo'
        },
        to: {
          left: '200px'
        }
      }).render(),
      `
      @-webkit-keyframes {
        from {
          left: 0px;
          whatever: hoo;
        }
        to {
          left: 200px;
        }
      }
      `
    )
  })
  it('should render as expected(3)', () => {
    assertEqual(
      c('a, b', {
        color: 'red'
      }, [
        c('c, d', {
          height: '10px'
        }, [
          c('e, f', {
            width: '12px'
          })
        ])
      ]).render(),
      `
      a, b {
        color: red;
      }
      a c, a d, b c, b d {
        height: 10px;
      }
      a c e, a c f, a d e, a d f, b c e, b c f, b d e, b d f {
        width: 12px;
      }   
      `
    )
  })
})
