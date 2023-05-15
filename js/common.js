(function ($) {
    'use strict';


    new WOW().init();
    $(document).ready(function () {
        // sticky_nav();
        blazy_init();
    });
 
    //init belazy
    function blazy_init() {
        const bLazy = new Blazy({});
    }

    // Sticky nav
    function sticky_nav() {
        $(window).scroll(function () {
            var sticky = $('#navbar_main'),
                scroll = $(window).scrollTop()
            if (scroll >= 50) {
                sticky.addClass('fixed-top');
                var navbar_height = $('.navbar').outerHeight(true)
                $('body').css('padding-top', navbar_height + 'px')
            }
            else {
                sticky.removeClass('fixed-top')
                $('body').css('padding-top', '0px')
            }
        });
    }

}(jQuery));