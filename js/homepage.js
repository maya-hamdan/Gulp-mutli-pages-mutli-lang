(function ($) {
    'use strict';

    $(document).ready(function () {
        home_video_popup();
        home_slider();
        home_counters();
    });
  

    //home slider
    function home_slider() {
        var menu = [];
        jQuery('.swiper-slide').each(function (index) {
            menu.push(jQuery(this).find('.slide-inner').attr("data-text"));
        });
        var interleaveOffset = 0.5;
        var swiperOptions = {
            loop: true,
            speed: 1000,
            parallax: true,
            autoplay: {
                delay: 6500,
                disableOnInteraction: false,
            },
            watchSlidesProgress: true,

            on: {
                progress: function () {
                    var swiper = this;
                    for (var i = 0; i < swiper.slides.length; i++) {
                        var slideProgress = swiper.slides[i].progress;
                        var innerOffset = swiper.width * interleaveOffset;
                        var innerTranslate = slideProgress * innerOffset;
                        swiper.slides[i].querySelector(".slide-inner").style.transform =
                            "translate3d(" + innerTranslate + "px, 0, 0)";
                    }
                },

                touchStart: function () {
                    var swiper = this;
                    for (var i = 0; i < swiper.slides.length; i++) {
                        swiper.slides[i].style.transition = "";
                    }
                },

                setTransition: function (speed) {
                    var swiper = this;
                    for (var i = 0; i < swiper.slides.length; i++) {
                        swiper.slides[i].style.transition = speed + "ms";
                        swiper.slides[i].querySelector(".slide-inner").style.transition =
                            speed + "ms";
                    }
                }
            }
        };
        var swiper = new Swiper(".swiper-container", swiperOptions);
        // DATA BACKGROUND IMAGE
        var sliderBgSetting = $(".slide-bg-image");
        sliderBgSetting.each(function (indx) {
            if ($(this).attr("data-background")) {
                $(this).css("background-image", "url(" + $(this).data("background") + ")");
            }
        });
    }

    //home video overlay 
    function home_video_popup() {
        $('#play-video').magnificPopup({
            preloader: true,
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            fixedContentPos: true
        });
    }

    //home Counters
    function home_counters() {
        if ($('#services').length) {
            var countersY = $('#services').offset().top;
            $(window).on('scroll', function (event) {
                if (countersY < $(window).scrollTop()) {
                    console.log('start loading');
                    $('.number').countTo();
                    $(this).off(event);
                }
            });
        }
    }


}(jQuery));