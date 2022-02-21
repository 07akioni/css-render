/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  CNode,
  CProperties,
  CssRenderInstance,
  CProperty,
  CPlainProperties,
  CRenderProps,
  CNodeChildren,
  CRenderOption,
  CSelectorPath
} from './types'
import { parseSelectorPath } from './parse'
import { isMediaOrSupports } from './utils'

const kebabRegex = /[A-Z]/g

function kebabCase (pattern: string): string {
  return pattern.replace(kebabRegex, match => '-' + match.toLowerCase())
}

/** TODO: refine it to solve nested object */
function unwrapProperty (
  prop: CProperty,
  indent: string = '  '
): string {
  if (typeof prop === 'object' && prop !== null) {
    return (
      ' {\n' +
      Object.entries(prop).map(v => {
        return indent + `  ${kebabCase(v[0])}: ${v[1] as string};`
      }).join('\n') +
      '\n' + indent + '}'
    )
  }
  return `: ${prop as string};`
}

/** unwrap properties */
function unwrapProperties <T extends CRenderProps> (
  props: CProperties,
  instance: CssRenderInstance,
  params: T
): CPlainProperties | string | undefined | null {
  if (typeof props === 'function') {
    return props({
      context: instance.context,
      props: params
    })
  }
  return props
}

function createStyle <T extends CRenderProps> (
  selector: string,
  props: CProperties,
  instance: CssRenderInstance,
  params: T
): string {
  if (!props) return ''
  // eslint-disable-next-line
  const unwrappedProps = unwrapProperties(props, instance, params)
  if (!unwrappedProps) return ''
  if (typeof unwrappedProps === 'string') {
    return `${selector} {\n${unwrappedProps}\n}`
  }
  const propertyNames = Object.keys(unwrappedProps)
  if (propertyNames.length === 0) {
    if (instance.config.keepEmptyBlock) return selector + ' {\n}'
    return ''
  }
  const statements = selector
    ? [
        selector + ' {'
      ]
    : []
  propertyNames.forEach(propertyName => {
    const property = unwrappedProps[propertyName]
    if (propertyName === 'raw') {
      statements.push('\n' + (property as string) + '\n')
      return
    }
    propertyName = kebabCase(propertyName)
    if (property !== null && property !== undefined) {
      statements.push(`  ${propertyName}${unwrapProperty(property)}`)
    }
  })
  if (selector) {
    statements.push('}')
  }
  return statements.join('\n')
}

function loopCNodeListWithCallback (children: CNodeChildren, options: CRenderOption, callback: (node: CNode | string) => any): void {
  /* istanbul ignore if */
  if (!children) return
  children.forEach(child => {
    if (Array.isArray(child)) {
      loopCNodeListWithCallback(child, options, callback)
    } else if (typeof child === 'function') {
      const grandChildren = child(options)
      if (Array.isArray(grandChildren)) {
        loopCNodeListWithCallback(grandChildren, options, callback)
      } else if (grandChildren) {
        callback(grandChildren)
      }
    } else if (child) {
      callback(child)
    }
  })
}

function traverseCNode <T extends CRenderProps> (
  node: CNode,
  selectorPaths: CSelectorPath,
  styles: string[],
  instance: CssRenderInstance,
  params: T,
  styleSheet?: CSSStyleSheet
): void {
  const $ = node.$
  let blockSelector = ''
  if (!$ || typeof $ === 'string') {
    if (isMediaOrSupports($)) {
      blockSelector = $
    } else {
      // as a string selector
      selectorPaths.push($)
    }
  } else if (typeof $ === 'function') {
    const selector = $({
      context: instance.context,
      props: params
    })
    if (isMediaOrSupports(selector)) {
      blockSelector = selector
    } else {
      // as a lazy selector
      selectorPaths.push(selector)
    }
  } else { // as a option selector
    if ($.before) $.before(instance.context)
    if (!$.$ || typeof $.$ === 'string') {
      if (isMediaOrSupports($.$)) {
        blockSelector = $.$
      } else {
        // as a string selector
        selectorPaths.push($.$)
      }
    } else /* istanbul ignore else */ if ($.$) {
      const selector = $.$({
        context: instance.context,
        props: params
      })
      if (isMediaOrSupports(selector)) {
        blockSelector = selector
      } else {
        // as a lazy selector
        selectorPaths.push(selector)
      }
    }
  }
  const selector = parseSelectorPath(selectorPaths)
  const style = createStyle(selector, node.props, instance, params)
  if (blockSelector) {
    styles.push(`${blockSelector} {`)
    if (styleSheet && style) {
      styleSheet.insertRule(`${blockSelector} {\n${style}\n}\n`)
    }
  } else {
    if (styleSheet && style) {
      styleSheet.insertRule(style)
    }
    if (!styleSheet && style.length) styles.push(style)
  }
  if (node.children) {
    loopCNodeListWithCallback(node.children, {
      context: instance.context,
      props: params
    }, childNode => {
      if (typeof childNode === 'string') {
        const style = createStyle(selector, { raw: childNode }, instance, params)
        if (styleSheet) {
          styleSheet.insertRule(style)
        } else {
          styles.push(style)
        }
      } else {
        traverseCNode(childNode, selectorPaths, styles, instance, params, styleSheet)
      }
    })
  }
  selectorPaths.pop()
  if (blockSelector) {
    styles.push('}')
  }
  if ($ && ($ as any).after) ($ as any).after(instance.context)
}

export function render <T extends CRenderProps> (
  node: CNode,
  instance: CssRenderInstance,
  props?: T,
  insertRule: boolean = false
): string {
  const styles: string[] = []
  traverseCNode(
    node,
    [],
    styles,
    instance,
    props,
    insertRule
      ? node.instance.__styleSheet
      : undefined
  )
  if (insertRule) return ''
  return styles.join('\n\n')
}
