$(function(){
    $('.bm-link').bmdModal();
});
(function($) {
    /**
     * The "Blackmagic Modal" plugin
     * -- Requires the ".bm-link" <a> tag
     * -- Optional Title, Sub Titles and Pagination
     * -- Optional Width and Height
     * -- href sets the image
     * -- data-title / data-subtitle sets the Modal title / subtitle
     * -- data-width / data-height sets the Modal width / height
     * -- data-type enables pagination (must be more than one modal with the same type)
     */

     /* Remove this section if used on BMD Website */
     /* ------------------------------------------ */
    function isRetinaDevice() {
        // Check the pixel ratio first
        if (window.devicePixelRatio > 1)
        {
            return true;
        }

        // If matchMedia is supported then do a media query
        if (window.matchMedia)
        {
            var mediaQuery = [
                'only screen and (-webkit-min-device-pixel-ratio: 2)',
                'only screen and (min-resolution: 2dppx)',
                'only screen and (min-resolution: 192dpi)'
            ].join(',');
            return window.matchMedia(mediaQuery).matches;
        }
        return false;
    }
     /* ------------------------------------------ */

    $.fn.bmdModal = function(options) {
        var currentImg;
        var totalOfType;
        var currentType;
        var settings = $.extend({
            type: {}
        }, options);
        var modalHtml = [
            '<div class="bm-overlay"></div>',
            '<div class="bm-load"></div>',
            '<div class="bmd-modal">',
                '<img src="">',
                '<div class="bm-header">',
                    '<h1></h1>',
                    '<h2></h2>',
                '</div>',
                '<div class="close"></div>',
                '<div class="bm-navigation">',
                    '<a href="#" class="arrow-left"></a>',
                    '<p><b></b></p>',
                    '<a href="#" class="arrow-right"></a>',
                '</div>',
            '</div>'
        ];

        this.bind('click.bmdModal', function(event) {
            event.preventDefault();

            var self = $(this);
            currentType = self.data('type');
            currentImg = $('[data-type="' + currentType + '"]').index(self) + 1;
            totalOfType = (settings.type)[currentType];
            $('.bm-load').addClass('loading');

            // On image load, show modal, remove loader
            $('.bmd-modal > img').attr('src', self.attr('href')).one('load', function(){
                // Reset Modal
                $('.bmd-modal, .bmd-modal > img').css({
                    'display': 'block',
                    'width': '',
                    'height': ''
                });
                var imgWidth = $('.bmd-modal > img').width();
                var imgHeight = $('.bmd-modal > img').height();
                if(isRetinaDevice()) {
                    imgWidth = imgWidth / 2;
                    imgHeight = imgHeight / 2;
                };
                $('.bmd-modal > img').css({
                    'width': imgWidth,
                    'height': imgHeight
                });
                // If modal size is set, center image
                if(self.data('width') || self.data('height')) {
                    $('.bmd-modal').css({
                        'display': 'flex',
                        'width': (self.data('width') ? self.data('width') : imgWidth),
                        'height': (self.data('height') ? self.data('height') : imgHeight)
                    }).addClass('expanded').hide().fadeIn('fast');
                } else {
                    $('.bmd-modal').css({
                        'width': imgWidth,
                        'height': imgHeight
                    }).removeClass('expanded').hide().fadeIn('fast');
                };
                $('.bm-load').removeClass('loading');
                $('.bm-overlay').fadeIn('fast');
            });

            // If title or subtitle exists, set the title
            self.data('title') ?
                $('.bm-header h1').html(self.data('title')) :
                $('.bm-header h1').html('');
            self.data('subtitle') ?
                $('.bm-header h2').html(self.data('subtitle')) :
                $('.bm-header h2').html('');

            // If link has a type, enable pagination
            if(currentType) {
                $('.bm-navigation').show();
                $('.bm-navigation p').html('<b>' + currentImg + '</b> of ' + totalOfType);
            } else {
                $('.bm-navigation').hide();
            };
        });

        // Close modal
        $(document.body).on('click', '.bm-overlay, .bmd-modal .close', function(){
            $('.bmd-modal').fadeOut(function(){
                $('.bm-overlay').fadeOut('fast');
            });
        });

        // Previous / Next modal of same type
        $(document.body).on('click', '.bm-navigation .arrow-left', function(event){
            (currentImg - 1) < 1 ? currentImg = totalOfType : currentImg--;
            loadNextImage(event);
        });
        $(document.body).on('click', '.bm-navigation .arrow-right', function(event){
            (currentImg + 1) > totalOfType ? currentImg = 1 : currentImg++;
            loadNextImage(event);
        });
        function loadNextImage(event) {
            event.preventDefault();
            $('.bm-load').addClass('loading');
            var nextImg = $("[data-type='" + currentType + "']")[(currentImg - 1)];
            nextImg.getAttribute('data-title') ?
                $('.bm-header h1').html(nextImg.getAttribute('data-title')) :
                $('.bm-header h1').html('');
            nextImg.getAttribute('data-subtitle') ?
                $('.bm-header h2').html(nextImg.getAttribute('data-subtitle')) :
                $('.bm-header h2').html('');
            $('.bmd-modal > img').one('load', function() {
                $('.bm-load').removeClass('loading');
                $(this).fadeIn('fast');
            }).fadeOut('fast').attr('src', nextImg.href);
            $('.bm-navigation p').html('<b>' + currentImg + '</b> of ' + totalOfType);
        };

        return this.each(function() {
            var thisType = $(this).data('type');
            var allTypes = settings.type;
            // Add image type, if it exists increase count by one
            if(thisType) {
                allTypes[(thisType)] ?
                    allTypes[(thisType)] += 1 :
                    allTypes[(thisType)] = 1;
            }
            // Add Modal to page
            if($('.bmd-modal').length === 0){
                $('body').append(modalHtml.join(''));
            };
        });
    };

}( jQuery ));

