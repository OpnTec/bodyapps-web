(function($) {

  var _update = function(data) {/* noop */};
  var vizFrame = $('<iframe src="bodyapps-viz/index.html">')
    .attr('seamless', 'seamlesss')
    .attr('scrolling', 'no')
    .attr('frameborder', '0')
    .css('width', '100%')
    .css('height', '500px');




  // When frame is loaded map `update` locally
  vizFrame.load(function() {
    _update = vizFrame[0].contentWindow.update;
  });

  // Attaches the iFrame to the DOM and returns an object to manipulate the frame contents
  $.fn.extend({
    bodyviz: function() {
      this.html(vizFrame);
      return {
        // need to wrap, since `_update` can change
        update: function(data) {_update(data)}
      }
    }
  });

})(jQuery);
