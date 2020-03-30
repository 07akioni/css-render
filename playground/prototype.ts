interface I {
  x: number
  y: string
}

const i: I = Object.create({
  x: 0
})

function a (): I {
  return i
}
