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
  }
]

export default testCases
