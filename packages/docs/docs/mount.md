# Advanced Mount & Unmount Options
Every [CNode](https://github.com/07akioni/css-render/blob/master/docs/overview.md) has `mount` & `unmount` methods.

They can help you mount style to the HTML document.

> Since `CNode` support lazy selector, properties and children evaluation, and some call of the `mount` will render the `CNode` again, the mounted style can be different in different mount.

## Mount
Render the `CNode`'s style and mount it to document.

```typescript
type mount = (
  options?: {
    id?: string, 
    props?: any,
    ssr?: SsrAdapter
    anchorMetaName?: string
  }
) => HTMLStyleElement
```

### `id`
- If `id` or `options` is `undefined`, every call of mount method will create a new `style` element with rendered style and mount it `document.head`. For example: `style.mount()` or `style.mount({ props: {} })`.
- If `id` is a `string`. It will mount the style on a `style[cssr-id="${id}"]` element to `document.head`. For example: `<head><style cssr-id="id">...</style></head>`. If the element already exists, the `mount` method will **not** refresh the content of the element.
### `props`
The `props` will be used as the render function's `props` during this mount.
### `ssr`
When mount the style in SSR environment, you should put correct ssr adapter in it.

### `anchorMetaName`

The name of a meta tag as a mount position anchor.

### Return Value
In non-ssr environment, the id element for the style to be mounted on.


## Unmount
Unmount the style of the CNode.

```typescript
type unmount = (
  options?: {
    id?: string
  }
) => void
```

### `id`
- If `id` or `options` is `undefined`, every mounted elements of the `CNode` will be unmounted.
- If `id` is a `string`. It will unmount `style[cssr-id="${id}"]` element mounted by the `CNode`.
