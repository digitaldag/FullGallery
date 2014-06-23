/* FullGallery v1
 * 
 * Responsive multi-Gallery with thumbinals, customizable transiction and content slideshow
 * 
 * Changelog
 * v1 (23/06/2014)
 * + Added back/forward button
 * + Fixed back-image management
 * + If just 1 image in the gallery no slideshow started
 * + Debug separate for each instance
 * + Removed debug function from minified version
 * + Added thumb active class on change image from non-thumb click
 * 
 * v0.3 (16/06/2014)
 * + Fixed var's mistake
 * + Added callback functions
 * + Added difference between animation forward and previous
 * + Added delay between actual and next image
 * + Added actual/next image animation separate details
 * 
 * v0.2 (14/06/2014)
 * + Fixed multiple gallery problem
 * + Fixed animation problem
 * 
 * v0.1 (13/06/2014)
 * + Initial release
 * 
 * License: This work is licensed under the Creative Commons Attribution 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
 * Contacts: digitald(at)big-d-web(dot)com
 */
(function($) {
        var content = [];
        var enVars = {};
        var options = [{
                        images: [],
                        status: 0,
                        animation: 'fade',
                        animationRunning: 0,
                        time: 6000,
                        prev: null,
                        next: null,
                        actual: null,
                        total: null,
                        base: null,
                        started: 0,
                        autoplay: false,
                        mini: null,
                        buttons: false,
                        debug:false
                }];

        var to = null;

        var _actual = new Array();
        var _prev = new Array();
        var _next = new Array();
        var _baseId = new Array();

        var animations = {
                fade: {
                        forward: {
                                before: {
                                        actual: {zIndex: -2, display: 'block', opacity: '1.0'},
                                        next: {zIndex: -1, display: 'block', opacity: '0.0'}
                                },
                                actualImageTo: null,
                                delay: 0,
                                nextImageTo: {css: {display: 'block', opacity: '1.0'}, time: 1000, method: 'linear'},
                                after: {
                                        actual: {zIndex: -3, display: 'none', opacity: '0.0'},
                                        next: {zIndex: -1, display: 'block'}
                                },
                        },
                        previous: {
                                before: {
                                        actual: {zIndex: -2, display: 'block', opacity: '1.0'},
                                        next: {zIndex: -1, display: 'block', opacity: '0.0'}
                                },
                                actualImageTo: null,
                                delay: 0,
                                nextImageTo: {css: {display: 'block', opacity: '1.0'}, time: 1000, method: 'linear'},
                                after: {
                                        actual: {zIndex: -3, display: 'none', opacity: '0.0'},
                                        next: {zIndex: -1, display: 'block'}
                                },
                        },
                        sync: false,
                        callbacks: {
                                before: function() {
                                },
                                after: function() {
                                }
                        }
                },
                slide: {
                        forward: {
                                before: {
                                        actual: {zIndex: 1, display: 'block', top: 0, left: 0},
                                        next: {zIndex: 2, display: 'block', top: 0, left: '100%'}
                                },
                                actualImageTo: {css: {left: '-100%'}, time: 1200, method: 'easeInOutExpo'},
                                delay: 0,
                                nextImageTo: {css: {left: '0'}, time: 1000, method: 'easeInOutExpo'},
                                after: {
                                        actual: {zIndex: 1, display: 'block', top: 0, left: '100%'},
                                        next: {zIndex: 1, display: 'block', top: 0, left: 0}
                                }
                        },
                        previous: {
                                before: {
                                        actual: {zIndex: 1, display: 'block', top: 0, left: 0},
                                        next: {zIndex: 2, display: 'block', top: 0, left: '-100%'}
                                },
                                actualImageTo: {css: {left: '100%'}, time: 1200, method: 'easeInOutExpo'},
                                delay: 0,
                                nextImageTo: {css: {left: '0'}, time: 1000, method: 'easeInOutExpo'},
                                after: {
                                        actual: {zIndex: 1, display: 'block', top: 0, left: '-100%'},
                                        next: {zIndex: 1, display: 'block', top: 0, left: 0}
                                },
                        },
                        sync: true,
                        callbacks: {
                                before: function() {
                                },
                                after: function() {
                                }
                        }
                }
        }

        $.fn.FullGallery = function()
        {
                argL = arguments.length;
                var that = this;
                var callback = false;

                var id = $(this).attr('id');
                id = (id == '' || id == undefined) ? 'FG' + Math.round(Math.random() * 10000000) : id;
                $(this).attr({'id': id});

                if (argL == 0) {
                        options[id] = options[0];
                }
                else if (argL == 1 && typeof arguments[0] == 'object') {
                        opt = arguments[0];
                }
                else if (argL == 2 && arguments[0] == 'animations' && typeof arguments[1] == 'object') {
                        animations = $.extend(arguments[1], animations);
                }
                else if (argL == 2 && typeof arguments[0] == 'string' && (typeof arguments[1] == 'object' || typeof arguments[1] == 'string')) {
                        opt = arguments[0];
                        optv = arguments[1];
                }
                else if (argL == 1 && typeof arguments[0] == 'string') {

                        switch (arguments[0])
                        {
                                case 'play':
                                        callback = play;
                                        break;
                                case 'stop':
                                        callback = stop;
                                        break;
                                case 'next':
                                        callback = next;
                                        break;
                                case 'prev':
                                        callback = prev;
                                        break;
                        }
                }
                else if (argL == 1 && typeof arguments[0] == 'number')
                {
                        callback = parseInt(arguments[0] * 1);
                        if (options[id].images[callback] != undefined && callback != options[id].actual)
                        {
                                options[id].actual = options[id].actual;
                                options[id].prev = (callback < 0) ? options[id].total : callback;
                                options[id].next = callback;
                                effect = (options[id].next > options[id].actual) ? 'n' : 'p';
                                animation(id, effect, true);
                        }
                }

                if (callback)
                {
                        if (typeof callback == 'function')
                                callback(id);
                }
                else
                {
                        if (typeof opt == 'object')
                        {
                                if (typeof options[id] == 'object')
                                {
                                        options[id] = $.extend({}, options[id], opt);
                                }
                                else
                                {
                                        options[id] = $.extend({}, options[0], opt);
                                }
                        }
                        if (typeof opt == 'string')
                        {
                                options[id][opt] = optv;
                        }
                        options[id].base = this;

                        if (options[id].started == 0) {
                                init(id);
                        }
                        options[id].started = 1;
                }
        }

        var init = function(id)
        {
                _baseId[id] = options[id].base;
                _baseId[id] = '#' + _baseId[id].attr('id') + ' ';
                if (options[id].images.length == 0)
                {
                        elements = 0;
                        $(options[id].base).children('ul').children('li').each(function() {
                                url = $(this).css('background-image').replace(/url\(/g, '');
                                url = url.replace(/\)/g, '');
                                options[id].images[elements] = {url: url.replace(/"/g, ''), content: $(this).html()}
                                elements++;
                        });
                }
                $(options[id].base).empty();

                switch (options[id].mini)
                {
                        case 'thumbnails':
                                thumbs_class = 'FG_thumb_list';
                                break;
                        default:
                                thumbs_class = 'FG_button_list';
                                break;
                }

                buttons = '';
                if (options[id].buttons) {
                        buttons = '<ul class="FG_buttons"><li class="prev"></li><li class="next"></li></ul>';
                }

                thumbs = '<ul class="' + thumbs_class + '">';
                for (i = 0; i < options[id].images.length; i++)
                {
                        z = -3;
                        d = 'none';
                        if (i == 0) {
                                z = -1;
                                d = 'block';
                        }

                        $(options[id].base).append('<div class="FG_image" image="' + i + '" style="z-index:' + z + ';background-image:url(' + options[id].images[i].url + ');display:' + d + ';">' + ((options[id].images[i].content == undefined) ? '' : options[id].images[i].content) + '</div>');

                        if (options[id].mini != null)
                        {
                                switch (options[id].mini)
                                {
                                        case 'thumbnails':
                                                thumbs += '<li class="FG_thumb_image" image="' + (i) + '" style="background-image:url(' + options[id].images[i].url + ');background-size:cover;background-position: center center;"></li>';
                                                break;
                                        default:
                                                thumbs += '<li class="FG_thumb_button" image="' + (i) + '"></li>';
                                                break;
                                }
                        }
                }
                thumbs += '</ul>';

                $(options[id].base).prepend(buttons + thumbs);
                
                $(_baseId[id] + ' > ul.FG_buttons > li.prev').click(function(){$(options[id].base).FullGallery('prev');});
                $(_baseId[id] + ' > ul.FG_buttons > li.next').click(function(){$(options[id].base).FullGallery('next');});
                
                $(_baseId[id] + ' > ul.' + thumbs_class + ' > li,' + _baseId[id] + '  > ul.' + thumbs_class + ' > li').click(function() {
                        if (!$(_baseId[id] + '.FG_image').is(':animated'))
                        {
                                log('No animation, start animating',id);
                                $(_baseId[id] + ' > ul > li').removeClass('FG_thumb_list_actual');

                                img = $(this).attr('image') * 1;
                                img = (img >= options[id].images.length) ? 0 : img;
                                img = (img < 0) ? options[id].images.length - 1 : img;

                                $(options[id].base).FullGallery(img);
                                $(this).addClass('FG_thumb_list_actual');
                        }
                });

                options[id].actual = 0;
                options[id].total = i - 1;
                options[id].prev = i - 1;
                options[id].next = 1;
                log(options[id],id);
                if (options[id].autoplay)
                        setTimeout(function() {
                                play(id);
                        }, options[id].time);
        }

        var stop = function(id) {

                options[id].status = 1;
                to = null;

        }

        var play = function(id) {

                options[id].status = 1;
                animation(id, options[id].animation, 'n', false);
        }

        var next = function(id) {
                animation(id, 'n', false);
        }
        var prev = function(id) {
                animation(id, 'p', false);
        }

        var animation = function(id, PoN, s) {

                if (options[id].total > 1)
                {
                        switch (PoN)
                        {
                                case 'p':
                                        effect = 'previous';
                                        break;
                                default:
                                        effect = 'forward';
                                        break;
                        }

                        var sA = animations[options[id].animation][effect];
                        var sAc = animations[options[id].animation];

                        if (PoN == 'p')
                        {
                                _actual[id] = options[id].actual;
                                _next[id] = options[id].prev;
                                
                                options[id].actual = options[id].prev;
                                options[id].prev = (options[id].actual - 1 < 0) ? options[id].total : options[id].actual - 1;
                                options[id].next = (options[id].actual + 1 > options[id].total) ? 0 : options[id].actual + 1;
                        }
                        else
                        {
                                _actual[id] = options[id].actual;
                                _next[id] = options[id].next;
                        
                                options[id].actual = options[id].next;
                                options[id].prev = (options[id].actual - 1 < 0) ? options[id].total : options[id].actual - 1;
                                options[id].next = (options[id].actual + 1 > options[id].total) ? 0 : options[id].actual + 1;
                        }
                        
                       log(options[id].prev+' < '+options[id].actual+' > '+options[id].next,id);

                        if (sA.before.actual != null) {
                                $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').css(sA.before.actual);
                                log('Before set actual',id);
                                if (typeof sAc.callbacks.before == 'function')
                                {
                                        sAc.callbacks.before('actual', _actual[id]);
                                }
                        }
                        if (sA.before.next != null) {
                                $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').css(sA.before.next);
                                log('Before set next',id);
                                if (typeof sAc.callbacks.before == 'function')
                                {
                                        sAc.callbacks.before('next', _next[id]);
                                }
                        }

                        if (sA.actualImageTo != null) {
                                log('Actual animation start',id);
                                $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').animate(sA.actualImageTo.css, sA.actualImageTo.time, sA.actualImageTo.method, function() {
                                        if (!sAc.sync && sA.nextImageTo != null)
                                        {
                                                log('Sync false',id);
                                                log('Next animation start',id);
                                                $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').animate(sA.nextImageTo.css, sA.nextImageTo.time, sA.nextImageTo.method, function() {
                                                        log('After set acutal',id);
                                                        $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').css(sA.after.actual);
                                                        if (typeof sAc.callbacks.after == 'function')
                                                        {
                                                                sAc.callbacks.after('actual', _actual[id]);
                                                        }
                                                        log('After set next',id);
                                                        $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').css(sA.after.next);
                                                        if (typeof sAc.callbacks.after == 'function')
                                                        {
                                                                sAc.callbacks.after('next', _next[id]);
                                                        }
                                                });
                                                log('Next animation end',id);
                                        }
                                        else
                                        {
                                                log('Sync true',id);
                                                log('After set acutal',id);
                                                $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').css(sA.after.actual);
                                                if (typeof sAc.callbacks.after == 'function')
                                                {
                                                        sAc.callbacks.after('actual', _actual[id]);
                                                }
                                        }
                                });
                                log('Actual animation end',id);
                        }
                        if (sA.nextImageTo != null)
                        {
                                log('Sync false',id);
                                log('Next animation start',id);
                                if (sA.delay > 0)
                                {
                                        $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').delay(sA.delay).animate(sA.nextImageTo.css, sA.nextImageTo.time, sA.nextImageTo.method, function() {

                                                if (!sAc.sync)
                                                {
                                                        log('After set acutal',id);
                                                        $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').css(sA.after.actual);
                                                        if (typeof sAc.callbacks.after == 'function')
                                                        {
                                                                sAc.callbacks.after('actual', _actual[id]);
                                                        }
                                                }

                                                log('After set next',id);
                                                $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').css(sA.after.next);
                                                if (typeof sAc.callbacks.after == 'function')
                                                {
                                                        sAc.callbacks.after('next', _next[id]);
                                                }
                                        });
                                        log('Next animation end',id);

                                        $(options[id].base).children('div.FG_image').removeClass('actual');
                                        $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').addClass('actual');
                                }
                                else
                                {
                                        $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').animate(sA.nextImageTo.css, sA.nextImageTo.time, sA.nextImageTo.method, function() {

                                                if (!sAc.sync)
                                                {
                                                        log('After set acutal',id);
                                                        $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').css(sA.after.actual);
                                                        if (typeof sAc.callbacks.after == 'function')
                                                        {
                                                                sAc.callbacks.after('actual', _actual[id]);
                                                        }
                                                }

                                                log('After set next',id);
                                                $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').css(sA.after.next);
                                                if (typeof sAc.callbacks.after == 'function')
                                                {
                                                        sAc.callbacks.after('next', _next[id]);
                                                }
                                        });
                                        log('Next animation end',id);

                                        $(options[id].base).children('div.FG_image').removeClass('actual');
                                        $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').addClass('actual');
                                        
                                        $(options[id].base).children('.FG_mini').children('li').removeClass('FG_thumb_list_actual');
                                        $(options[id].base).children('.FG_mini').children('li[image="' + _next[id] + '"]').addClass('FG_thumb_list_actual');
                                }
                        }

                        if (options[id].status == 1) {
                                to = setTimeout(function() {
                                        animation(id, 'n');
                                }, options[id].time);
                        }
                }
        }

        var log = function(msg,id)
        {
                if (options[id].debug)
                {
                        console.log(msg);
                }
        }

})(jQuery);
