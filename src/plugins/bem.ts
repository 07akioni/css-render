const namespace = 'n'

let block = null
let elements = null

export const b = function (arg: string) {
  return {
    beforeEnter () {
      block = arg
      elements = null
    },
    afterLeave () {
      block = null
    },
    selector () {
      return `.${namespace}-${block}`
    }
  }
}

export const e = function (...args: Array<string>) {
  return {
    beforeEnter () {
      elements = args
    },
    afterLeave () {
      elements = null
    },
    selector () {
      return args.map(arg => `.${namespace}-${block}__${arg}`).join(', ')
    }
  }
}

export const m = function (...args: Array<string>) {
  return {
    beforeEnter () {},
    afterLeave () {},
    selector () {
      function elementToSelector (element?) {
        return args.map(arg => `&.${namespace}-${block}${
          element ? `__${element}` : ''
        }--${arg}`).join(', ')
      }
      return elements ? elements.map(
        elementToSelector
      ).join(', ') : elementToSelector()
    }
  }
}

export const notM = function (arg: string) {
  return {
    beforeEnter () {},
    selector () {
      return `&:not(.${namespace}-${block}${
        elements && elements[0] ? `__${elements[0]}` : ''
      }--${arg})`
    }
  }
}
