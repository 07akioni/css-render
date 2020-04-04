# Advanced Mount & Unmount Options
Every [CNode](https://github.com/07akioni/css-render/blob/master/docs/overview.md) has `mount` & `unmount` methods.

They can help you mount style to the HTML document.

> Since `CNode` support lazy properties and selector evaluation, and most call of `mount` will render the `CNode` again, the mounted style can be different in each mount.

## Mount
Render the `CNode`'s style and mount it to document.

```mount(options?: { target?: string | number | HTMLStyleElement, props?: any })```

### target
- If `target` or `options` is `undefined`, every call of mount method will create a `style` element with rendered styles and mount it `document.head`.
- If `target` is a `string` or `number`. It will mount the style to a `style[css-render-id="${target}"]` element to `document.head` and set `mount-count` attribute of the element to `1`. If the element already exists, the `mount` method will **not** refresh the content of the element but plus the `mount-count` attribute of the element by `1`.
- If `target` is a `HTMLStyleElement`, and the `target` has no `mount-count` attribute, the `innerHTML` of the `target` will be set to the rendered style and the `mount-count` attribute will be set to `1`, or it will only plus the `mount-count` attribute of the `target` by `1` and not refresh the target's content.
### props
The `props` will be used as the render function's `prop` during this mount.
## Unmount
Unmount the style of the CNode.

```unmount(options?: { target?: string | number | HTMLStyleElement })```

### Target
- If `target` or `options` is `undefined`, every mounted elements of the `CNode` will be unmounted.
- If `target` is `undefined`, every mounted elements of the `CNode` will be unmounted.
- If `target` is a `string` or `number`. It will unmount `style[css-render-id="${target}"]` element mounted by the `CNode` if the element's `mount-count` is `1`. Or it will minus the element's `mount-count` by `1`.
- If `target` is a `HTMLStyleElement`. It will unmount `target` element if it is mounted by the `CNode` when the element's `mount-count` is `1`. Or it will minus the element's `mount-count` by `1`.

---

## Note
Manage the mount target carefully, or it may cause some bugs.
