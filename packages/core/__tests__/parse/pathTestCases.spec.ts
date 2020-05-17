interface CSelectorTestCase { input: Array<string | null | undefined>, output: string }

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
  },
  {
    input: ['a, b', '.whatever:is(div, span, p), .freestyle', 'c, d'],
    output: 'a .whatever:is(div, span, p) c, a .whatever:is(div, span, p) d, a .freestyle c, a .freestyle d, b .whatever:is(div, span, p) c, b .whatever:is(div, span, p) d, b .freestyle c, b .freestyle d'
  },
  {
    input: ['body', 'pfx &.dark'],
    output: 'pfx body.dark'
  },
  {
    input: ['body', '', 'body'],
    output: 'body body'
  },
  {
    input: ['body', '', 'pfx &.dark'],
    output: 'pfx body.dark'
  },
  {
    input: ['body', null, 'pfx &.dark'],
    output: 'pfx body.dark'
  },
  {
    input: ['body', '   ', 'pfx &.dark'],
    output: 'pfx body.dark'
  },
  {
    input: ['  body ', '   ', '  pfx &.dark '],
    output: 'pfx body.dark'
  },
  {
    input: [' a, b ', '', ' &   + c, d', ' ', 'e, &  + f '],
    output: 'a + c e, a + c + f, a d e, a d + f, b + c e, b + c + f, b d e, b d + f'
  },
  {
    input: [' a, b ', '', '', null, ' &   + c, d', ' ', 'e, &  + f '],
    output: 'a + c e, a + c + f, a d e, a d + f, b + c e, b + c + f, b d e, b d + f'
  },
  {
    input: ['a, b', undefined, '& + c, d', null, 'e, & + f'],
    output: 'a + c e, a + c + f, a d e, a d + f, b + c e, b + c + f, b d e, b d + f'
  }
]

export default testCases
