(function($) {

  // Attach to a global scope
  var root = this

    , encode = window.encodeURIComponent
    , noop = function noop() {}
    , slice = Array.prototype.slice

    , graph_url = 'https://graph.facebook.com/fql?q='
    , like_url = '//www.facebook.com/plugins/like.php?'
    , stylesheet = [
        '.facebook-like-box_count, .facebook-like-button_count {'
      ,   'overflow: hidden;'
      ,   'position: relative;'
      , '}'
      , '.facebook-like iframe, .facebook-like .facebook-like-counter {'
      ,   'float: left'
      , '}'
      , '.facebook-like-counter {'
      ,   'color: #333;'
      ,   'text-align: center;'
      ,   'white-space: nowrap;'
      ,   'font-family: \'lucida grande\',tahoma,verdana,arial,sans-serif;'
      , '}'
      // Box
      , '.facebook-like-box_count {'
      ,   'height: 70px;'
      , '}'
      , '.facebook-like-box_count .facebook-like-counter {'
      ,   'left: 1px;'
      ,   'width: 39px;'
      ,   'height: 19px;'
      ,   'padding: 6px 1px 2px 3px;'
      ,   'top: 1px;'
      ,   'font-size: 13px;'
      ,   'background: white;'
      ,   'position: absolute;'
      , '}'
      // Button
      , '.facebook-like-button_count {'
      ,   'height: 30px;'
      , '}'
      , '.facebook-like-button_count .facebook-like-counter {'
      ,   'border: 1px solid #c1c1c1;'
      ,   'height: 14px;'
      ,   'line-height: 14px;'
      ,   'margin-top: 1px;'
      ,   'margin-left: 6px;'
      ,   'min-width: 15px;'
      ,   'padding: 1px 2px;'
      ,   'font-size: 11px;'
      ,   'position: relative'
      , '}'
      , '.facebook-like-button_count .facebook-like-nub {'
      ,   'height: 0;'
      ,   'left: -5px;'
      ,   'position: absolute;'
      ,   'top: 4px;'
      ,   'width: 5px;'
      ,   'z-index: 2;'
      , '}'
      , '.facebook-like-button_count .facebook-like-nub s,'
      , '.facebook-like-button_count .facebook-like-nub i {'
      ,   'border-style: solid;'
      ,   'border-color: transparent #d7d7d7 transparent;'
      ,   'border-width: 4px 5px 4px 0;'
      ,   'display: block;'
      ,   'position: absolute;'
      ,   'left: 0;'
      ,   'top: 0;'
      ,   'height: 0;'
      , '}'
      , '.facebook-like-button_count .facebook-like-nub i {'
      ,   'border-right-color: white;'
      ,   'left: 2px;'
      , '}'
      // General
      , '.facebook-like iframe {'
      ,   'border: none;'
      ,   'overflow: hidden;'
      ,   'width: 49px;'
      , '}'
      , '.facebook-fetch-error iframe {'
      ,   'width: 200px;'
      , '}'
      , '.facebook-fetch-error .facebook-like-counter {'
      ,   'display: none;'
      , '}'
      , '.facebook-like-nub, .facebook-like-counter {'
      ,   'display: inline-block;'
      , '}'
    ].join('')

    // Store a static reference to the style element once created.
    , style_element;

  // Default parameters to pass to facebooks button.
  root.defaultButtonOptions = {
      send: 'false'
    , layout: 'button_count'
    , width: '53'
    , show_faces: 'false'
    , action: 'like'
    , colorscheme: 'light'
    , font: 'arial'
    , height: '80'
  };
  root.defaultSettings = {
      count: 'like'
    , timeout: 2000
  };

  // Attach the stylesheet to the document.
  function createStyleElement() {
    if (style_element) return;
    if ((style_element = $('#facebook-like-styles')[0])) return;
    style_element = $('<style id="facebook-like-styles">' + stylesheet + '</style>').appendTo('head')[0];
  }

  // Return an URI encoded querystring of the passed object.
  function queryString(options) {
    var values = [];
    for (var attribute in options) if (options.hasOwnProperty(attribute)) {
      values.push(attribute + '=' + encode(options[attribute]));
    }
    return values.join('&amp;');
  }

  // ## LikeButton

  function LikeButton(dom, settings) {
    this.dom = dom;
    this.$dom = $(dom);
    this.graph_settings = settings;
    this.options = $.extend({}, root.defaultButtonOptions, this.parseOptions());
    this.iframe_url = like_url + queryString(this.options);
  }

  // Parse the data options from the dom element and return them.
  LikeButton.prototype.parseOptions = function() {
    var layout = this.dom.getAttribute('data-layout')
      , options = {};

    options.href = this.dom.getAttribute('data-href');
    if (layout && 'box_count button_count'.indexOf(layout) !== -1) {
      options.layout = layout;
    }
    return options;
  };

  LikeButton.prototype.setData = function(data) {
    this.graph_data = data;
    if (!data.error) {
      var count_number = data[this.graph_settings.count + '_count'];
      this.counter = root.formatNumber(count_number);
    }
    return this;
  };

  LikeButton.prototype.render = function() {
    var classes = ['facebook-like-' + this.options.layout];
    if (this.graph_data.error) classes.push('facebook-fetch-error');

    var content = [
        '<div class="' + classes.join(' ') + '">'
      ,   '<iframe src=' + this.iframe_url + ' scrolling="no" frameborder="0" allowTransparency="true"></iframe>'
      ,   '<div class="facebook-like-counter">'
      ,     '<div class="facebook-like-number">' + (this.counter ? this.counter : '') + '</div>'
      ,     '<div class="facebook-like-nub"><s></s><i></i></div>'
      ,   '</div>'
      , '</div>'
    ].join('');

    this.$dom.append(content);
    return this;
  };

  // Fetch the Graph data for all buttons bundled into one JSON request.
  function fetchGraphData(map, settings, cb) {
    var urls = [];
    for (var url in map) if (map.hasOwnProperty(url)) {
      urls.push(url);
    }

    function graphFailure() {
      var args = slice.call(arguments);
      for (var url in map) if (map.hasOwnProperty(url)) {
        for (var i = 0, l = map[url].length; i < l; i++) {
          map[url][i]
            .setData({ error: true })
            .render();
        }
      }
      root.error.apply(this, args);
      if (typeof cb === 'function') cb.apply(this, args);
    }

    $.ajax({
        url: root.createQuery(urls)
      // Graph API wont allow crossdomain for IE unless jsonp is used.
      , dataType: 'jsonp'
      , timeout: settings.timeout
    })
    .done(function(json, textStatus, jqXHR) {
      var args = slice.call(arguments);
      try {
        for (var i = 0, l = json.data.length; i < l; i++) {
          var data = json.data[i]
            , buttons = map[data.url];

          for (var j = 0; j < buttons.length; j++) {
            buttons[j]
              .setData(data)
              .render();
          }
        }
      } catch(e) {
        // The json array wasnt what we expected.
        textStatus = 'parseerror';
        return graphFailure.call(this, json, textStatus, jqXHR);
      }
      // Call success handlers
      root.success.apply(this, args);
      // We dont use the deferred.always as we want to return an error
      // on unexpected json value.
      if (typeof cb === 'function') cb.apply(this, args);
    })
    .fail(graphFailure);
  }

  // ### #formatNumber()
  //
  // Format a number according to show the Facebook button displays them,
  // eg. 9100 -> 9.1k

  root.formatNumber = function(number) {
    number = number + '';
    if (number < 1000) {
      return number; // 999
    } else if (number < 10000) {
      number = (number / 1000).toFixed(1) + 'k';
      return number.replace('.0', ''); // 9.1k
    } else if (number < 1000000) {
      return (number / 1000).toFixed(0) + 'k'; // 10k
    } else if (number < 10000000) {
      number = (number / 1000 / 1000).toFixed(1) + 'm'; // 1.1m
      return number.replace('.0', '');
    } else if (number < 100000000) {
      return (number / 1000 / 1000).toFixed(0) + 'm'; // 11m
    }
  };

  // ### #createQuery()
  //
  // Returns the Graph query url for this array of urls.

  root.createQuery = function(urls) {
    return graph_url +
      encode('SELECT url, share_count, like_count, comment_count, ' +
        'total_count, commentsbox_count, click_count FROM link_stat ' +
        'WHERE url IN (\'' + urls.join('\', \'') + '\')');
  };


  // ### #succes()
  //
  // Global success callback.

  root.success = noop;

  // ### #error()
  //
  // Global error callback.

  root.error = noop;

  // ### #parse()
  // Parse the dom for facebook like buttons.
  //
  // Options:
  //
  // * $el: (optional) Elements to parse. Defaults to .facebook-like selector
  // * settings: (optional) Object containing graph settings.
  //   * count: share|like|comment|total|commentsbox|click. Defaults to like.
  // * cb: (optional) Callback function. This will be called with the $.ajax
  //   response
  //
  // Usage:
  //
  //     FBLike.parse();
  //     FBLike.parse($('.fb-like'), { count: 'total' });
  //     FBLike.parse(function(data, textStatus) { $frame.fadeIn(); });

  root.parse = function($el, settings, cb) {
    createStyleElement();
    if ($el && $el.nodeName) $el = $($el);
    if (!($el instanceof jQuery)) {
      if ($.isPlainObject) settings = $el;
      else if (typeof $el === 'function') cb = $el;
      $el = $('.facebook-like');
    }
    if (!$.isPlainObject(settings)) {
      if (typeof settings === 'function') cb = settings;
      settings = root.defaultSettings;
    }

    var map = {};
    $el.each(function() {
      if (!$.data(this, 'fblike')) {
        var href = this.getAttribute('data-href')
          , button = new LikeButton(this, settings);

        if (!map[href]) map[href] = [];
        map[href].push(button);
        $.data(this, 'fblike', button);
      }
    });

    if ($.isEmptyObject(map)) cb({}, 'notmodified');
    else fetchGraphData(map, settings, cb);
    return this;
  };

}).call((this.FBLike = {}), jQuery);
