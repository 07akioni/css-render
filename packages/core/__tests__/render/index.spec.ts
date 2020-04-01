import CSSRender from 'css-render'
import { assertEqual } from '@css-render/shared/utils'

const {
  h
} = CSSRender()

describe('#render', () => {
  it('should render as expected(1)', () => {
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
  it('should render as expected(2)', () => {
    assertEqual(
      h('body', [
        h('&.dark', {
          backgroundColor: 'black'
        }),
        h('.container', {
          width: '100%'
        })
      ]).render()
      ,
    `body.dark {
      background-color: black;
    }
    
    body .container {
      width: 100%;
    }`)
  })
})
