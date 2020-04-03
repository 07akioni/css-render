import CSSRender from 'css-render'
import { assertEqual } from '@css-render/shared/utils'

const {
  c
} = CSSRender()

describe('#render', () => {
  it('should work with nested nodes array', () => {
    assertEqual(
      c('body', {
        margin: 0,
        backgroundColor: 'white'
      }, [
        [
          [
            c('&.dark', {
              backgroundColor: 'black'
            })
          ],
          c('.container', {
            width: '100%'
          })
        ]
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
  it('should render as expected(1)', () => {
    assertEqual(
      c('body', {
        margin: 0,
        backgroundColor: 'white'
      }, [
        c('&.dark', {
          backgroundColor: 'black'
        }),
        c('.container', {
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
      c('body', [
        c('&.dark', {
          backgroundColor: 'black'
        }),
        c('.container', {
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
  it('should render as excepted(3)', () => {
    assertEqual(
      c('@keyframes what-a-good-animation', {
        from: {
          color: 'white',
          backgroundColor: 'black'
        },
        to: {
          color: 'black',
          backgroundColor: 'white'
        }
      }).render(),
      `@keyframes what-a-good-animation {
        from {
          color: white;
          background-color: black;
        }
        to {
          color: black;
          background-color: white;
        }
      }`
    )
  })
  it('should render a function typed prop', () => {
    assertEqual(
      c('@keyframes what-a-good-animation', () => ({
        from: {
          color: 'white',
          backgroundColor: 'black'
        },
        to: {
          color: 'black',
          backgroundColor: 'white'
        }
      })).render(),
      `@keyframes what-a-good-animation {
        from {
          color: white;
          background-color: black;
        }
        to {
          color: black;
          background-color: white;
        }
      }`
    )
  })
  it('should render an array as root', () => {
    assertEqual(
      c([
        c('sel1', {
          position: 'relative'
        }, [
          c('&.sel2', {
            position: 'relative'
          })
        ]),
        c('sel1', {
          position: 'relative'
        }, [
          c('&.sel2', {
            position: 'relative'
          })
        ])
      ]).render(),
      `
      sel1 {
        position: relative;
      }
      sel1.sel2 {
        position: relative;
      }
      sel1 {
        position: relative;
      }
      sel1.sel2 {
        position: relative;
      }
      `
    )
  })
})
