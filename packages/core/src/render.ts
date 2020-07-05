import {
  CNode,
  CProperties,
  CSSRenderInstance,
  CProperty,
  CPlainProperties,
  CRenderProps,
  CNodeChildren,
  CRenderOption,
  CSelectorPath
} from './types'
import { parseSelectorPath } from './parse'

const kebabRegex = /[A-Z]/g

function kebabCase (pattern: string): string {
  return pattern.replace(kebabRegex, match => '-' + match.toLowerCase())
}

/** TODO: refine it to solve nested object */
function upwrapProperty (
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
function upwrapProperties <T extends CRenderProps> (
  props: CProperties,
  instance: CSSRenderInstance,
  params: T
): CPlainProperties | undefined | null {
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
  instance: CSSRenderInstance,
  params: T
): string {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!props) return ''
  // eslint-disable-next-line
  const unwrappedProps = upwrapProperties(props, instance, params)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!unwrappedProps) return ''
  const propertyNames = Object.keys(unwrappedProps)
  if (propertyNames.length === 0) {
    if (instance.config.preserveEmptyBlock) return selector + ' {\n}'
    return ''
  }
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const statements = selector ? [
    selector + ' {'
  ] : []
  propertyNames.forEach(propertyName => {
    const property = unwrappedProps[propertyName]
    if (propertyName === 'raw') {
      statements.push('\n' + (property as string) + '\n')
      return
    }
    propertyName = kebabCase(propertyName)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (property !== null && property !== undefined) {
      statements.push(`  ${propertyName}${upwrapProperty(property)}`)
    }
  })
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (selector) {
    statements.push('}')
  }
  return statements.join('\n')
}

function loopCNodeListWithCallback (children: CNodeChildren, options: CRenderOption, callback: (node: CNode | string) => any): void {
  /* istanbul ignore if */
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!children) return
  children.forEach(child => {
    if (Array.isArray(child)) {
      loopCNodeListWithCallback(child, options, callback)
    } else if (typeof child === 'function') {
      const grandChildren = child(options)
      if (Array.isArray(grandChildren)) {
        loopCNodeListWithCallback(grandChildren, options, callback)
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      } else if (grandChildren) {
        callback(grandChildren)
      }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    } else if (child) {
      callback(child)
    }
  })
}

function traverseCNode <T extends CRenderProps> (
  node: CNode,
  selectorPaths: CSelectorPath,
  styles: string[],
  instance: CSSRenderInstance,
  params: T
): void {
  const $ = node.$
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!$ || typeof $ === 'string') {
    // as a string selector
    selectorPaths.push($)
  } else if (typeof $ === 'function') {
    // as a lazy selector
    selectorPaths.push($({
      context: instance.context,
      props: params
    }))
  } else { // as a option selector
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if ($.before) $.before(instance.context)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!$.$ || typeof $.$ === 'string') {
      selectorPaths.push($.$)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    } else /* istanbul ignore else */ if ($.$) {
      selectorPaths.push($.$({
        context: instance.context,
        props: params
      }))
    }
  }
  const selector = parseSelectorPath(selectorPaths)
  const style = createStyle(selector, node.props, instance, params)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (style.length) styles.push(style)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (node.children) {
    loopCNodeListWithCallback(node.children, {
      context: instance.context,
      props: params
    }, childNode => {
      if (typeof childNode === 'string') {
        styles.push(
          createStyle(selector, { raw: childNode }, instance, params)
        )
      } else {
        traverseCNode(childNode, selectorPaths, styles, instance, params)
      }
    })
  }
  selectorPaths.pop()
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if ($ && ($ as any).after) ($ as any).after(instance.context)
}

export function render <T extends CRenderProps> (
  node: CNode,
  instance: CSSRenderInstance,
  props?: T
): string {
  const styles: string[] = []
  traverseCNode(node, [], styles, instance, props)
  return styles.join('\n\n')
}
