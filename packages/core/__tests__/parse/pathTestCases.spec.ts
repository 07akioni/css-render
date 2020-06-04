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
    input: ['.a > b', '&.c, &.d'],
    output: '.a > b.c, .a > b.d'
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
    input: ['body', 'pfx&.dark'],
    output: 'pfxbody.dark'
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
  },
  {
    input: ['', '&.a'],
    output: '.a'
  },
  {
    input: ['.header', '.menu', '.no-borderradius &'],
    output: '.no-borderradius .header .menu'
  },
  {
    input: ['.grand', '.parent', '& > &'],
    output: '.grand .parent > .grand .parent'
  },
  {
    input: ['.grand', '.parent', '&&'],
    output: '.grand .parent.grand .parent'
  },
  {
    input: ['.grand', '.parent', '&, &ish'],
    output: '.grand .parent, .grand .parentish'
  },
  {
    input: ['a, b', '&.c'],
    output: 'a.c, b.c'
  },
  {
    input: ['a, b', '& &'],
    output: 'a a, a b, b a, b b'
  },
  {
    input: ['p, a, ul, li', '& + &'],
    output: 'p + p, p + a, p + ul, p + li, a + p, a + a, a + ul, a + li, ul + p, ul + a, ul + ul, ul + li, li + p, li + a, li + ul, li + li'
  },
  {
    input: ['div', 'span, p, span'],
    output: 'div span, div p, div span'
  },
  {
    input: ['a, b, c', 'x'],
    output: 'a x, b x, c x'
  },
  {
    input: ['a, b, c', 'x + y'],
    output: 'a x + y, b x + y, c x + y'
  }
]

export default testCases
