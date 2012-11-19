/*globals describe:true it:true expect:true $:true before:true */
(function() {
  describe('Facebook Like button', function() {
    describe('correctness', function() {
      var graph_count;
      before(function(cb) {
        var url = 'https://graph.facebook.com/fql?q=SELECT like_count FROM link_stat WHERE url = \'http://www.google.com\'';
        $.ajax({
          url: url,
          dataType: 'jsonp',
          timeout: 1000
        }).done(function (data) {
          graph_count = window.FBLike.formatNumber(data.data[0].like_count);
          cb();
        });
      });
      it('should display correct number', function(done) {
        window.FBLike.parse($('#correctness'), function() {
          expect($('#correctness').find('.facebook-like-number').text()).to.eql(graph_count);
          done();
        });
      });
    });
    describe('#formatNumber()', function() {
      it('should parse numbers correctly', function() {
        expect(window.FBLike.formatNumber(999)).to.equal('999');
        expect(window.FBLike.formatNumber(1000)).to.equal('1k');
        expect(window.FBLike.formatNumber(9900)).to.equal('9.9k');
        expect(window.FBLike.formatNumber(10000)).to.equal('10k');
        expect(window.FBLike.formatNumber(10100)).to.equal('10k');
        expect(window.FBLike.formatNumber(111111)).to.equal('111k');
        expect(window.FBLike.formatNumber(1000000)).to.equal('1m');
        expect(window.FBLike.formatNumber(1100000)).to.equal('1.1m');
        expect(window.FBLike.formatNumber(11100000)).to.equal('11m');
      });
    });
    describe('#parse()', function() {

      it('should parse specified element', function(done) {
        window.FBLike.parse(document.getElementById('button_count'), function() {
          expect($('#button_count').find('.facebook-like-button_count').length).to.equal(1);
          expect($('#button_count').find('.facebook-like-number').text()).to.not.be.empty();
          expect($('#box_count').find('.facebook-like-number').length).to.equal(0);
          done();
        });
      });
      it('should fall back to default look when graph service is down', function(done) {
        var graph_url = window.FBLike.graph_url;
        window.FBLike.graph_url = 'https://google.comasdsadasd/?';
        window.FBLike.parse(document.getElementById('box_count'), function() {
          expect($('#box_count').hasClass('facebook-fetch-error')).to.be(true);
          expect($('#box_count').find('iframe').width()).to.be(200);
          expect($('#box_count').find('.facebook-like-counter').is(':visible')).to.be(false);
          expect($('#box_count').find('.facebook-like-number').text()).to.be.empty();
          window.FBLike.graph_url = graph_url;
          done();
        });
      });
      it('should parse jQuery element', function(done) {
        window.FBLike.parse($('#foo'), function() {
          expect($('#foo').find('.facebook-like-box_count').length).to.equal(1);
          expect($('#foo').find('.facebook-like-number').text()).to.not.be.empty();
          done();
        });
      });
      it('should parse dom element', function(done) {
        window.FBLike.parse(document.getElementById('bar'), function() {
          expect($('#bar').find('.facebook-like-box_count').length).to.equal(1);
          expect($('#bar').find('.facebook-like-number').text()).to.not.be.empty();
          done();
        });
      });
      it('should parse css selector', function(done) {
        window.FBLike.parse('.selector-test', function() {
          expect($('.selector-test').find('.facebook-like-box_count').length).to.equal(1);
          expect($('.selector-test').find('.facebook-like-number').text()).to.not.be.empty();
          done();
        });
      });
      it('should parse everything', function(done) {
        window.FBLike.parse(function() {
          expect($('#not_parsed').find('.facebook-like-box_count').length).to.equal(1);
          expect($('#not_parsed').find('.facebook-like-number').text()).to.not.be.empty();
          done();
        });
      });
    });
  });
})();
