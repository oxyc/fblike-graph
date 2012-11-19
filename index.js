(function($) {
  var FBLike = this.FBLike = {};
  var encode = window.encodeURIComponent;
  var style_element;

  FBLike.like_url = '//www.facebook.com/plugins/like.php?href=';
  FBLike.graph_url = 'https://graph.facebook.com/fql?q=';
  FBLike.stylesheet = [
    '.facebook-like-box_count, .facebook-like-button_count {',
      'overflow: hidden;',
      'position: relative;',
    '}',
    '.facebook-like iframe, .facebook-like .facebook-like-counter {',
      'float: left',
    '}',
    '.facebook-like-counter {',
      'color: #333;',
      'text-align: center;',
      'white-space: nowrap;',
    '}',
    // Box
    '.facebook-like-box_count {',
      'height: 70px;',
    '}',
    '.facebook-like-box_count .facebook-like-counter {',
      'left: 1px;',
      'width: 39px;',
      'height: 19px;',
      'padding: 6px 1px 2px 3px;',
      'top: 1px;',
      'font-size: 13px;',
      'background: white;',
      'position: absolute;',
    '}',

    // Button
    '.facebook-like-button_count {',
      'height: 30px;',
    '}',
    '.facebook-like-button_count .facebook-like-counter {',
      'border: 1px solid #c1c1c1;',
      'height: 14px;',
      'line-height: 14px;',
      'margin-left: 6px;',
      'min-width: 15px;',
      'padding: 1px 2px;',
      'font-size: 11px;',
      'position: relative',
    '}',
    '.facebook-like-button_count .facebook-like-nub {',
      'height: 0;',
      'left: -5px;',
      'position: absolute;',
      'top: 4px;',
      'width: 5px;',
      'z-index: 2;',
    '}',
    '.facebook-like-button_count .facebook-like-nub s,',
    '.facebook-like-button_count .facebook-like-nub i {',
      'border-style: solid;',
      'border-color: transparent #d7d7d7 transparent;',
      'border-width: 4px 5px 4px 0;',
      'display: block;',
      'position: absolute;',
      'left: 0;',
      'top: 0;',
      'height: 0;',
    '}',
    '.facebook-like-button_count .facebook-like-nub i {',
      'border-right-color: white;',
      'left: 2px;',
    '}',
    // General
    '.facebook-like iframe {',
      'border: none;',
      'overflow: hidden;',
      'width: 50px;',
    '}',
    '.facebook-fetch-error iframe {',
      'width: 200px',
    '}',
    '.facebook-fetch-error .facebook-like-counter {',
      'display: none;',
    '}',
    '.facebook-like-nub, .facebook-like-counter {',
      'display: inline-block;',
    '}'
  ].join('');

  FBLike.defaults = {
    send: 'false',
    layout: 'button_count',
    width: '53',
    show_faces: 'false',
    action: 'like',
    colorscheme: 'light',
    font: 'arial',
    height: '80'
  };

  FBLike.createButton = function(layout, url) {
    var content = [
      '<div class="facebook-like-' + layout + '">',
        '<iframe src=' + url + ' scrolling="no" frameborder="0" allowTransparency="true"></iframe>',
        '<div class="facebook-like-counter">',
          '<div class="facebook-like-number"></div>',
          '<div class="facebook-like-nub"><s></s><i></i></div>',
        '</div>',
      '</div>'
    ].join('');

    return $(content);
  };

  FBLike.parseOptions = function(dom) {
    var options = FBLike.defaults;
    var layout = dom.getAttribute('data-layout');

    options.href = dom.getAttribute('data-href');
    if (layout && 'box_count button_count'.indexOf(layout) !== -1) {
      options.layout = dom.getAttribute('data-layout');
    }
    return options;
  };

  FBLike.formatNumber = function(number) {
    number = number + '';
    if (number < 1000) {
      return number; // 999
    } else if (number < 10000) {
      number = (number/1000).toFixed(1) + 'k';
      return number.replace('.0', ''); // 9.1k
    } else if (number < 1000000) {
      return (number/1000).toFixed(0) + 'k'; // 10k
    } else if (number < 10000000) {
      number = (number/1000/1000).toFixed(1) + 'm'; // 1.1m
      return number.replace('.0', '');
    } else if (number < 100000000) {
      return (number/1000/1000).toFixed(0) + 'm'; // 11m
    }
  };

  FBLike.fetch = function(dom, cb) {
    var url = dom.getAttribute('data-href');
    var query = 'SELECT like_count FROM link_stat WHERE url = \'' + url + '\'';

    $.ajax({
      url: FBLike.graph_url + encode(query),
      dataType: 'jsonp', // This is required for IE
      timeout: 1000
    }).done(function(data, textStatus) {
      updateCounter(dom, data, textStatus);
      if (typeof cb === 'function') cb();
    }).fail(function(jqXHR, textStatus) {
      updateCounter(dom, {}, textStatus);
      if (typeof cb === 'function') cb();
    });
  };


  function createStyleElement() {
    if (style_element) return;
    if ((style_element = $('#facebook-like-styles')[0])) return;
    style_element = $('<style id="facebook-like-styles">' + FBLike.stylesheet + '</style>').appendTo('head')[0];
  }

  function createURL(options) {
    var values = [];
    for (var attribute in options) {
      values.push(attribute + '=' + encode(options[attribute]));
    }
    return FBLike.like_url + values.join('&amp;');
  }

  function updateCounter(dom, json, textStatus) {
    var success = false;
    switch (textStatus) {
      case 'success':
        try {
          var count = json.data[0].like_count;
          $(dom).find('.facebook-like-number').text(FBLike.formatNumber(count));
          success = true;
        } catch(e) {}
        break;
      case 'notmodified':
        success = true;
        break;
    }
    if (!success) {
      $(dom)
        .addClass('facebook-fetch-error')
        .trigger('facebook-fetch-error');
    }
  }

  FBLike.parse = function(dom, cb) {
    if (typeof dom === 'string') return FBLike.parse($(dom), cb);
    if (!dom || typeof dom === 'function') {
      FBLike.parse($('.facebook-like').not('.facebook-like-processed'), dom);
      return this;
    }

    if (dom instanceof jQuery) {
      var i = 0;
      var count = dom.length;
      var counter = function() { if (++i >= count && typeof cb === 'function') cb(); };

      dom.each(function() {
        FBLike.parse(this, counter);
      });
      return this;
    }
    if (!dom.nodeName) return false;
    if (dom.className.indexOf('facebook-like-processed') >= 0) return;

    createStyleElement();
    var options = FBLike.parseOptions(dom);
    var url = createURL(options);
    var $button = FBLike.createButton(options.layout, url);

    $(dom).append($button).addClass('facebook-like-processed');
    return FBLike.fetch(dom, cb);
  };
}).call(this, jQuery);
