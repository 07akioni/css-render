# Advanced Mount & Unmount Options
Every [CNode](https://github.com/07akioni/css-render/blob/master/docs/overview.md) has `mount` & `unmount` methods.

They can help you mount style to the HTML document.

> Since `CNode` support lazy selector, properties and children evaluation, and some call of the `mount` will render the `CNode` again, the mounted style can be different in different mount.

## Mount
Render the `CNode`'s style and mount it to document.

```typescript
type mount = (
  options?: {
    target?: string, 
    props?: any,
    count?: boolean
  }
) => HTMLStyleElement
```

### `target`
- If `target` or `options` is `undefined`, every call of mount method will create a new `style` element with rendered style and mount it `document.head`.
- If `target` is a `string`. It will mount the style on a `style[cssr-id="${target}"]` element to `document.head` and set `mount-count` attribute of the element to `1`. For example: `<head><style cssr-id="target" mount-count="1">...</style></head>`. If the element already exists, the `mount` method will **not** refresh the content of the element but plus the `mount-count` attribute of the element by `1`.
### `props`
The `props` will be used as the render function's `props` during this mount.
### `count`
- If `count` is not set, it will be treated as `true`.
- If it is set to `false`, the mount won't have any effects on `mount-count` of the target.
### Return Value
The target element for the style to mount on.


## Unmount
Unmount the style of the CNode.

```typescript
type unmount = (
  options?: {
    target?: string,
    count?: boolean
  }
) : void
```

### `target`
- If `target` or `options` is `undefined`, every mounted elements of the `CNode` will be unmounted.
- If `target` is a `string`. It will unmount `style[cssr-id="${target}"]` element mounted by the `CNode` if the element's `mount-count` is `1` or `null`. Or it will minus the element's `mount-count` by `1`.

### `count`
- If `count` is not set, it will be treated as `false`.
