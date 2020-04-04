## Advanced Mount & Unmount Options
A `CNode` has `mount` & `unmount` methods.

They can help you mount style to the HTML document.

> Since `CNode` support lazy properties & selector evaluation, and most call of `mount` will render the `CNode` again, the mounted style can be different in each mount.

### Mount
#### `mount(options?: { target?: string | number | HTMLStyleElement })`
- If `target` or `options` is `undefined`, every call of mount method will create a `style` element with rendered styles and mount it `document.head`.
- If `target` is a `string` or `number`. It will mount the style to a `style[css-render-id="${target}"]` element to `document.head` and set `mount-count` attribute of the element to `1`. If the element already exists, the `mount` method will **not** refresh the content of the element but plus the `mount-count` attribute of the element by `1`.
- If `target` is a `HTMLStyleElement`, and the `target` has no `mount-count` attribute, the `innerHTML` of the `target` will be set to the rendered style and the attribute will be set to `1`. Or it will only plus the `mount-count` attribute of the `target` by `1`.
#### `unmount(options?: { target?: string | number | HTMLStyleElement })`
- If `target` or `options` is `undefined`, every mounted elements of the `CNode` will be unmounted.
- If `target` is `undefined`, every mounted elements of the `CNode` will be unmounted.
- If `target` is a `string` or `number`. It will unmount `style[css-render-id="${target}"]` element mounted by the `CNode` if the element's `mount-count` is `1`. Or it will minus the element's `mount-count` by `1`.
- If `target` is a `HTMLStyleElement`. It will unmount `target` element if it is mounted by the `CNode` when the element's `mount-count` is `1`. Or it will minus the element's `mount-count` by `1`.