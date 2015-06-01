// Test for position sticky support (Only Chrome Canary at time of writing)
Modernizr.addTest('csssticky', function(){
  var bool;
  Modernizr.testStyles("#modernizr { position: -webkit-sticky;position: -moz-sticky;position: -o-sticky; position: -ms-sticky; position: sticky;}", function(elem, rule) {
    bool = ((window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle)["position"]).indexOf("sticky") !== -1
  });
  return bool;
});

(function($) {
  $.fn.shimSticky = function() {
    var cssPattern        = /\s*(.*?)\s*{(.*?)}/g;
    var matchPosition     = /\.*?position:.*?sticky.*?;/
    var getTop            = /\.*?top:(.*?);/
    var toObserve      		= [];

    var parse = function(css) {

      var matches,
        css = css.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '').replace(/\n|\r/g, '');
      while ((matches = cssPattern.exec(css)) !== null){
        var selector = matches[1];
        if (matchPosition.test(matches[2]) && selector !== "#modernizr"){
          var topMatch  = getTop.exec(matches[2]),
            topCSS    = ((topMatch !== null)?parseInt(topMatch[1]) : 0);
          $(selector).each(function(){
            var elem = $(this),
              height    = elem.height(),
              parent    = elem.parent(),
              parOff    = parent.offset(),
              parOffTop = ((parOff !== null && parOff.top !== null)?parOff.top:0),
              elmOff    = elem.offset(),
              elmOffTop = ((elmOff !== null && elmOff.top !== null)?elmOff.top:0),
              start     = elmOffTop - topCSS,
              end     	 = (parOffTop + parent.outerHeight(false)) - height - topCSS,
              newCSS    = matches[2] + "position:fixed;width:"+elem.width()+"px;height:"+height+"px";
            toObserve.push({element : elem, parent : parent, repl : $('<span style="position:static;display:block;height:'+height+'px;"></span>'), start : start, end : end, oldCSS : matches[2], newCSS : newCSS, fixed : false});
          });
        }
      }
    }

    $('style').each(function() {
      $(this).is('link') ?  $.get(this.href).success(function(css) { parse(css); }) : parse($(this).text());
    });

    var $window = $(window);

    $window.scroll(function(e){
      var scrollTop = $window.scrollTop();
      for (var i=0;i<toObserve.length;i++){
        var obj = toObserve[i];
        if (obj.fixed === false && scrollTop > obj.start && scrollTop < obj.end){
          obj.element.attr('style', obj.newCSS);
          obj.repl.insertBefore(obj.element);
          obj.fixed = true;
        }else if (obj.fixed === true){
          if (scrollTop < obj.start){
            obj.element.attr('style', obj.oldCSS);
            obj.fixed = false;
            obj.repl.remove();
          } else if (scrollTop > obj.end){
            var absolute = obj.element.offset();
            absolute.position = "absolute"; // Overwrite with absolute;
            obj.element.attr('style', obj.newCSS).css(absolute);
            obj.fixed = false;
          }
        }
      }

    });

  };
})(jQuery);