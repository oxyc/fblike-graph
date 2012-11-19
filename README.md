# FBLike

Due to a very annoying [Facebook bug][bug] the visible like count differs from the
count received from graph api. Due to this, sorting items by facebook likes
becomes very annoying as visitors see different results.

This plugin tries to fix this by outputting the actual like count from Graph
API.

## Getting started

```html
<div class="facebook-like" data-href="http://www.google.com" data-layout="box_count"></div>
```

```javascript
FBLike.parse();
```

## Usage

### `FBLike.parse(element, callback)`

* `element` (optional) A DOM Element, a jQuery selector or a jQuery object.
  If left empty, all elements with the `.facebook-like` class will be parsed.

* `callback` (optional) Called once the data has been fetched.

Check the test suite for examples.

## Features

* Exposes some internal functions which you can override for customization
* Has a test suite (Currently not tested crossbrowser!)
* Browser support: _(Coming soon!)_
* If the Graph API service is down, it will fall back silently to facebooks
  default counter.

## Limitations

* The only options which will be parsed are layout and href.
* Currently only `box_count` and `button_count` works as a layout.
* The message popup won't be displayed once liked as this method uses an
  iframe.

## License

MIT

[bug]: http://developers.facebook.com/bugs/169035286562837/
