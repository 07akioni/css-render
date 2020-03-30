import CSSRender from 'css-render'
import { assertEqual } from '@css-render/shared/utils'

const {
  h
} = CSSRender()

describe('# parse selector path', () => {
  it('should render as expected', () => {
    assertEqual(
      h('body', {
        margin: 0,
        backgroundColor: 'white'
      }, [
        h('&.dark', {
          backgroundColor: 'black'
        }),
        h('.container', {
          width: '100%'
        })
      ]).render()
      ,
    `body {
      margin: 0;
      background-color: white;
    }
    
    body.dark {
      background-color: black;
    }
    
    body .container {
      width: 100%;
    }`)
  })
})
