# FBLike Graph Data [![Build Status](https://secure.travis-ci.org/oxyc/fblike-graph.png?branch=master)](https://travis-ci.org/oxyc/fblike-graph)

Due to a very annoying [Facebook bug][bug] the visible like count differs from the
count received from graph api. Due to this, sorting items by facebook likes
becomes very annoying as visitors see different results.

This plugin tries to fix this by outputting the actual like count from Graph
API.

**Still in development**

## Getting started

* Include jQuery.
* Include this script.

```html
<div class="facebook-like" data-href="http://www.google.com" data-layout="box_count"></div>
```

```javascript
FBLike.parse();
```

### `FBLike.parse(elements, options, callback)`

* `element` (optional) A jQuery object.
  If left empty, all elements with the `.facebook-like` class will be parsed.

* `options` (optional)
  * `options.count` (defaults to like)

* `callback` (optional) Called once the data has been fetched.

Check the test suite or docs/example.html for examples.

## Features

* Has a test suite (Currently not tested crossbrowser!)
* If the Graph API service is down, it will fall back silently to facebooks
  default counter.

## Limitations

* Depends on jQuery.
* The only options which will be parsed are layout and href.
* Currently only `box_count` and `button_count` works as a layout.
* The message popup won't be displayed once liked as this method uses an
  iframe.

## Known bugs
* Tests fail in older FF (mocha), graceful fallback fails in safari < 5.1 (windows)

## Build

`yeoman build`

## License

MIT

[bug]: http://developers.facebook.com/bugs/169035286562837/
