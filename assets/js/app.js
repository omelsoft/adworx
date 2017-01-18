(function($) {
     "use strict";

     /**
      * Number.prototype.format(n, x, s, c)
      * 
      * @param integer n: length of decimal
      * @param integer x: length of whole part
      * @param mixed   s: sections delimiter
      * @param mixed   c: decimal delimiter
      */
     Number.prototype.format = function(n, x, s, c) {
          var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
               num = this.toFixed(Math.max(0, ~~n));

          return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
     };

    $.event.special.widthChanged = {
        remove: function() {
            $(this).children('iframe.width-changed').remove();
        },
        add: function () {
            var elm = $(this);
            var iframe = elm.children('iframe.width-changed');
            if (!iframe.length) {
                iframe = $('<iframe/>').addClass('width-changed').prependTo(this);
            }
            var oldWidth = elm.width();
            function elmResized() {
                var width = elm.width();
                if (oldWidth != width) {
                    elm.trigger('widthChanged', [width, oldWidth]);
                    oldWidth = width;
                }
            }

            var timer = 0;
            var ielm = iframe[0];
            (ielm.contentWindow || ielm).onresize = function() {
                clearTimeout(timer);
                timer = setTimeout(elmResized, 20);
            };
        }
    }

    $.event.special.heightChanged = {
        remove: function() {
            $(this).children('iframe.height-changed').remove();
        },
        add: function () {
            var elm = $(this);
            var iframe = elm.children('iframe.height-changed');
            if (!iframe.length) {
                iframe = $('<iframe/>').addClass('height-changed').prependTo(this);
            }
            var oldHeight = elm.height();
            function elmResized() {
                var height = elm.height();
                if (oldHeight != height) {
                    elm.trigger('heightChanged', [height, oldHeight]);
                    oldHeight = height;
                }
            }

            var timer = 0;
            var ielm = iframe[0];
            (ielm.contentWindow || ielm).onresize = function() {
                clearTimeout(timer);
                timer = setTimeout(elmResized, 20);
            };
        }
    }

     //Handles menu drop down
     $('.dropdown-menu').find('form').click(function(e) {
          e.stopPropagation();
     });


     initLoader();
     $(window).resize(function(){ initLoader() });

     function initLoader() {
        $('.loader-wrapper').css({
          width: $('#main').width(),
          height: window.innerHeight,
          display: 'block',
          overflow: 'visible'
       });     
     }

})(jQuery);
