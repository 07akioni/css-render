const namespace = 'n'

let block = null
let elements = null

const b = function (arg) {
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

const e = function (...args) {
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

const m = function (...args) {
  return {
    beforeEnter () {},
    afterLeave () {},
    selector () {
      function elementToSelector (element) {
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

const notM = function (arg) {
  return {
    beforeEnter () {},
    selector () {
      return `&:not(.${namespace}-${block}${
        elements && elements[0] ? `__${elements[0]}` : ''
      }--${arg})`
    }
  }
}

module.exports = {
  b, e, m, notM
}