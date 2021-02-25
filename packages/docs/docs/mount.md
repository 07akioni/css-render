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
    count?: boolean
  }
) => HTMLStyleElement
```

### `id`
- If `id` or `options` is `undefined`, every call of mount method will create a new `style` element with rendered style and mount it `document.head`.
- If `id` is a `string`. It will mount the style on a `style[cssr-id="${id}"]` element to `document.head`. For example: `<head><style cssr-id="id">...</style></head>`. If the element already exists, the `mount` method will **not** refresh the content of the element.
### `props`
The `props` will be used as the render function's `props` during this mount.
### `count`
- If `count` is not set, it will be treated as `false`.
- If `count` is `true`, the mounted style element will have a `mount-count` attribute, reflects how many times you have mount the style.
### Return Value
The id element for the style to be mounted on.


## Unmount
Unmount the style of the CNode.

```typescript
type unmount = (
  options?: {
    id?: string,
    count?: boolean
  }
) : void
```

### `id`
- If `id` or `options` is `undefined`, every mounted elements of the `CNode` will be unmounted.
- If `id` is a `string`. It will unmount `style[cssr-id="${id}"]` element mounted by the `CNode`.

### `count`
- If `count` is not set, it will be treated as `false`.
- If `count` is set to `true`, it will minus the element's `mount-count` by `1`. If `mount-count` is `1` the element will be removed.
