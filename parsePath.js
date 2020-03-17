function joinPath (amp, selector) {
  if (/,/g.test(selector)) {
    return selector.split(',').map(part => {
      const trimmedPart = part.trim()
      if (/&/g.test(trimmedPart)) {
        return trimmedPart.replace(/&/g, amp)
      } else {
        return amp + ' ' + trimmedPart
      }
    }).join(', ')
  } else if (/&/g.test(selector)) {
    return selector.replace(/&/g, amp)
  } else {
    return amp + ' ' + selector
  }
}

module.exports = function parsePath (path) {
  let amp = ''
  const afterLeaveCallbacks = []
  path.forEach((selector) => {
    if (typeof selector === 'object') {
      selector.beforeEnter()
    }
    afterLeaveCallbacks.push(selector.afterLeave)
    const path = typeof selector === 'object' ? selector.selector() : selector
    if (/,/g.test(amp)) {
      amp = amp
        .split(',')
        .map(ampPart => joinPath(ampPart.trim(), path.trim()))
        .join(', ')
        .trim()
    } else {
      amp = joinPath(amp.trim(), path.trim()).trim()
    }
  })
  while (afterLeaveCallbacks.length) {
    const callback = afterLeaveCallbacks.pop()
    if (callback) callback()
  }
  return amp.trim()
}

// console.log(parsePath(['.a', '.b', '&.c, &.d', '&.e, > .f']))
// console.log(parsePath(['.a', '> b', '&.c, &.d', '&.e, > .f']))