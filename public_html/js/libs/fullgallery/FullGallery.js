/* FullGallery v0.3
 * 
 * Responsive multi-Gallery with thumbinals, customizable transiction and content slideshow
 * 
 * Changelog
 * v0.3 (16/06/2014)
 * + Fixed var mistake
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
                        mini: null
                }];
        var debug = false;
        var to = null;
        
        var _actual = new Array();
        var _prev = new Array();
        var _next = new Array();
        var _baseId = new Array();
                        
        var animations = {
                fade: {
                        before: {
                                actual: {zIndex: -2, display: 'block', opacity: '1.0'},
                                next: {zIndex: -1, display: 'block', opacity: '0.0'}
                        },
                        actualImageTo: null,
                        nextImageTo: {display: 'block', opacity: '1.0'},
                        after: {
                                actual: {zIndex: -3, display: 'none', opacity: '0.0'},
                                next: {zIndex: -1, display: 'block'}
                        },
                        sync: false,
                        time: 1500,
                        method: 'linear'
                },
                slide: {
                        before: {
                                actual: {zIndex: 1, display: 'block', top: 0, left: 0},
                                next: {zIndex: 1, display: 'block', top: 0, left: '-100%'}
                        },
                        actualImageTo: {left: '100%'},
                        nextImageTo: {left: '0'},
                        after: {
                                actual: {zIndex: 1, display: 'block', top: 0, left: '-100%'},
                                next: {zIndex: 1, display: 'block', top: 0, left: 0}
                        },
                        sync: true,
                        time: 1500,
                        method: 'easeInOutExpo'
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
                                options[id].prev = (callback - 1 < 0) ? options[id].images.length : callback;
                                options[id].next = callback;
                                effect = (options[id].next > options[id].actual)?'n':'p';
                                animation(id, 'n', true);
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
                        case 'thumbinal':
                                thumbs_class = 'FG_thumb_list';
                                break;
                        default:
                                thumbs_class = 'FG_button_list';
                                break;
                }

                thumbs = '<ul class="' + thumbs_class + '">';
                for (i = 0; i < options[id].images.length; i++)
                {
                        z = -3;
                        d = 'none';
                        if (i == options[id].images.length - 1)
                                z = -1;
                        d = 'block';
                        $(options[id].base).append('<div class="FG_image" image="' + i + '" style="z-index:' + z + ';background-image:url(' + options[id].images[i].url + ');display:' + d + ';">' + ((options[id].images[i].content == undefined) ? '' : options[id].images[i].content) + '</div>');

                        if (options[id].mini != null)
                        {
                                switch (options[id].mini)
                                {
                                        case 'thumbinal':
                                                thumbs += '<li class="FG_thumb_image" image="' + (i) + '" style="background-image:url(' + options[id].images[i].url + ');background-size:cover;background-position: center center;"></li>';
                                                break;
                                        default:
                                                thumbs += '<li class="FG_thumb_button" image="' + (i) + '"></li>';
                                                break;
                                }
                        }
                }
                thumbs += '</ul>';

                $(options[id].base).prepend(thumbs);
                $(_baseId[id] + ' > ul > li,'+_baseId[id] + '  > ul > li').click(function() {
                        if (!$(_baseId[id] + '.FG_image').is(':animated'))
                        {
                                console.log($(this).attr('image'));
                                $(_baseId[id] + ' > ul > li').removeClass('FG_thumb_list_actual');
                                $(options[id].base).FullGallery($(this).attr('image') * 1);
                                $(this).addClass('FG_thumb_list_actual');
                        }
                });

                options[id].actual = i - 1;
                options[id].total = i - 1;
                options[id].prev = i - 2;
                options[id].next = 0;
                log(options[id]);
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

                var sA = animations[options[id].animation];
                
                
                
                s = (s == true) ? false : true;

                //if (s)
                //{
                        _actual[id] = options[id].actual;
                        _prev[id] = options[id].prev;
                        _next[id] = options[id].next;
                //}

                if (PoN == 'p')
                {
                        options[id].actual = options[id].prev;
                        options[id].prev = (options[id].actual - 1 < 0) ? options[id].total : options[id].actual - 1;
                        options[id].next = (options[id].actual + 1 > options[id].total) ? 0 : options[id].actual + 1;
                }
                else
                {
                        options[id].actual = options[id].next;
                        options[id].prev = (options[id].actual - 1 < 0) ? options[id].total : options[id].actual - 1;
                        options[id].next = (options[id].actual + 1 > options[id].total) ? 0 : options[id].actual + 1;
                }

                if (sA.before.actual != null) {
                        $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').css(sA.before.actual);
                        log('Before set actual');
                }
                if (sA.before.next != null) {
                        $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').css(sA.before.next);
                        log('Before set next');
                }

                if (sA.actualImageTo != null) {
                        log('Actual animation start');
                        $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').animate(sA.actualImageTo, sA.time, sA.method, function() {
                                if (!sA.sync && sA.nextImageTo != null)
                                {
                                        log('Sync false');
                                        log('Next animation start');
                                        $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').animate(sA.nextImageTo, sA.time, sA.method, function() {
                                                log('After set acutal');
                                                $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').css(sA.after.actual);
                                                log('After set next');
                                                $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').css(sA.after.next);
                                        });
                                        log('Next animation end');
                                }
                                else
                                {
                                        log('Sync true');
                                        log('After set acutal');
                                        $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').css(sA.after.actual);
                                }
                        });
                        log('Actual animation end');
                }
                if (sA.nextImageTo != null)
                {
                        log('Sync false');
                        log('Next animation start');
                        $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').animate(sA.nextImageTo, sA.time, sA.method, function() {

                                if (!sA.sync)
                                {
                                        log('After set acutal');
                                        $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').css(sA.after.actual);
                                }

                                log('After set next');
                                $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').css(sA.after.next);
                        });
                        log('Next animation end');

                        $(options[id].base).children('div.FG_image').removeClass('actual');
                        $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').addClass('actual');
                }

                if (options[id].status == 1) {
                        to = setTimeout(function() {
                                animation(id, 'n');
                        }, options[id].time);
                }

        }

        var log = function(msg)
        {
                if (debug)
                {
                        console.log(msg);
                }
        }

})(jQuery);
