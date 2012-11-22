/*globals describe:true it:true expect:true $:true before:true after: true */
(function(FBLike) {
  describe('Facebook Like button', function() {

    describe('Graph data', function() {

      var graph_count = {};
      before(function(cb) {
        var url = FBLike.createQuery(['http://www.google.com']);
        $.ajax({ url: url, dataType: 'jsonp', timeout: 1000 })
          .done(function (data) {
            graph_count = data.data[0];
            cb();
          });
      });

      it('should calculate correct like_count by default', function(done) {
        FBLike.parse($('#like_count'), function(data) {
          var $button = $('#like_count')
            , count = FBLike.formatNumber(graph_count.like_count);

          expect(data.data[0].like_count).to.equal(graph_count.like_count);
          expect($button.find('.facebook-like-number').text()).to.equal(count);

          done();
        });
      });

      it('should calculate correct custom count', function(done) {
        FBLike.parse($('#total_count'), { count: 'total' }, function(data) {
          var count = FBLike.formatNumber(graph_count.total_count);

          expect(data.data[0].total_count).to.equal(graph_count.total_count);
          expect($('#total_count').find('.facebook-like-number').text()).to.equal(count);

          done();
        });
      });
    });

    describe('#formatNumber()', function() {
      it('should parse numbers correctly', function() {
        expect(FBLike.formatNumber(999)).to.equal('999');
        expect(FBLike.formatNumber(1000)).to.equal('1k');
        expect(FBLike.formatNumber(9900)).to.equal('9.9k');
        expect(FBLike.formatNumber(10000)).to.equal('10k');
        expect(FBLike.formatNumber(10100)).to.equal('10k');
        expect(FBLike.formatNumber(111111)).to.equal('111k');
        expect(FBLike.formatNumber(1000000)).to.equal('1m');
        expect(FBLike.formatNumber(1100000)).to.equal('1.1m');
        expect(FBLike.formatNumber(11100000)).to.equal('11m');
      });
    });

    describe('Graceful failure', function() {
      var createQuery, error, error_called = false;
      before(function() {
        createQuery = FBLike.createQuery;
        error = FBLike.error;
      });

      it('should fall back to default look when graph service sends 404', function(done) {
        FBLike.createQuery = function() {
          return 'foobar';
        };
        FBLike.parse($('#failure_404'), function(data, textStatus) {
          var $button = $('#failure_404');
          data = data; // jshint

          expect(textStatus).to.equal('error');
          expect($button.find('iframe').width()).to.be(200);
          expect($button.find('.facebook-like-counter').is(':visible')).to.be(false);
          expect($button.find('.facebook-like-number').text()).to.be.empty();

          done();
        });
      });

      it('should fall back to default look when graph service timeouts', function(done) {
        FBLike.createQuery = function() {
          return 'https://foo.bar';
        };
        FBLike.defaultSettings.timeout = 1000;

        FBLike.parse($('#failure_timeout'), function(data, textStatus) {
          data = data; // jshint
          expect(textStatus).to.equal('timeout');
          done();
        });
      });

      it('should fall back to default look when graph service returns invalid json', function(done) {
        FBLike.createQuery = function(urls) {
          return 'https://graph.facebook.com/fql?q=' +
            window.encodeURIComponent('SELECT total_count FROM link_stat WHERE url IN (\'' + urls.join('\', \'') + '\')');
        };

        FBLike.parse($('#failure_invalid'), function(data, textStatus) {
          data = data; // jshint
          expect(textStatus).to.equal('parseerror');
          done();
        });
      });

      it('should trigger exposed error function', function(done) {
        FBLike.createQuery = function() {
          return 'foobar';
        };
        FBLike.error = function() {
          error_called = true;
        };
        FBLike.parse($('#failure_exposed'), function() {
          expect(error_called).to.be.ok();
          done();
        });
      });

      after(function() {
        FBLike.createQuery = createQuery;
        FBLike.error = error;
        FBLike.defaultSettings.timeout = 2000;
      });
    });

    describe('#parse()', function() {
      var success, success_called = false;

      before(function() {
        success = FBLike.success;
        FBLike.success = function() {
          success_called = true;
        };
      });

      it('should parse specified element', function(done) {
        FBLike.parse($('#specified_element'), function(data, textStatus) {
          var $button = $('#specified_element');

          expect(textStatus).to.equal('success');
          expect(data.data[0].like_count).to.be.a('number');
          expect($button.find('.facebook-like-button_count').length).to.equal(1);
          expect($button.find('.facebook-like-number').text()).to.not.be.empty();

          done();
        });
      });

      it('should parse dom element', function(done) {
        FBLike.parse(document.getElementById('dom_element'), function() {
          var $button = $('#dom_element');

          expect($button.find('.facebook-like-button_count').length).to.equal(1);
          expect($button.find('.facebook-like-number').text()).to.not.be.empty();

          done();
        });
      });

      it('should trigger exposed success function', function(done) {
        FBLike.parse($('#dom_element'), function() {
          expect(success_called).to.be.ok();
          done();
        });
      });

      it('should parse everything', function(done) {
        FBLike.parse(function() {
          var $button = $('#not_parsed');
          expect($button.find('.facebook-like-box_count').length).to.equal(1);
          expect($button.find('.facebook-like-number').text()).to.not.be.empty();
          done();
        });
      });

      after(function() {
        FBLike.success = success;
      });
    });
  });
}(window.FBLike));
