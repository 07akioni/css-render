interface CSelectorTestCase { input: string[], output: string }

const testCases: CSelectorTestCase[] = [
  {
    input: ['', '.a', '.b'],
    output: '.a .b'
  },
  {
    input: ['.a', '.b'],
    output: '.a .b'
  },
  {
    input: ['.a', '&'],
    output: '.a'
  },
  {
    input: ['.a', '& + a'],
    output: '.a + a'
  },
  {
    input: ['.a', 'b, & c'],
    output: '.a b, .a c'
  },
  {
    input: ['.a', '> b', '&.c, &.d', '&.e, > .f'],
    output: '.a > b.c.e, .a > b.c > .f, .a > b.d.e, .a > b.d > .f'
  },
  {
    input: ['', '.a', '> b', '&.c, &.d', '&.e, > .f'],
    output: '.a > b.c.e, .a > b.c > .f, .a > b.d.e, .a > b.d > .f'
  },
  {
    input: ['.a > b', '&', '&', '&'],
    output: '.a > b'
  },
  {
    input: ['', '.a > b', '&', '&', '&'],
    output: '.a > b'
  },
  {
    input: ['a, b', 'c, d', 'e, f'],
    output: 'a c e, a c f, a d e, a d f, b c e, b c f, b d e, b d f'
  },
  {
    input: ['a, b', '& + c, d', 'e, & + f'],
    output: 'a + c e, a + c + f, a d e, a d + f, b + c e, b + c + f, b d e, b d + f'
  },
  {
    input: ['@keyframes good-animation'],
    output: '@keyframes good-animation'
  }
]

export default testCases
