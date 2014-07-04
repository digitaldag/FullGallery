/* FullGallery v1.2.1
 * 
 * Responsive multi-Gallery with thumbinals, customizable transiction and content slideshow
 * 
 * Changelog
 * v1.2.1 (04/07/2014)
 * + Rewrited youtube and video management
 * + Added "start" & "end" options to youtube and video
 * + Added custom & external video control (play, stop, mute, unmute, restart, fadein, fadeout)
 * 
 * v1.2 (30/06/2014)
 * + Added external animation inclusion for more and/or custom animations
 * + Added possibility to manage thumb in external place
 * + Fixed countdown fails on manual slide change
 * 
 * v1.1.2 (27/06/2014)
 * + Added background and slider html5 video
 * + Added background Youtube video
 * + Added thumb from video
 * + Added countdown element
 * + Added preload option and functionality before starting slideshow
 * 
 * v1.1.1 (26/06/2014)
 * + Added numeric type in gallery thumbs
 * + Added jquery ui support for thumb transiction
 * 
 * v1.1 (25/06/2014)
 * + Change tab detection
 * + Callback functions on init, animationStart, animationEnd, play, stop, tabFocus and tabBlur
 * + Timeout reset on image change manually
 * 
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

//Vars and default options
        var content = [];
        var enVars = {};
        var options = [{
                        images: [],
                        status: null,
                        animation: 'fade',
                        time: 6000,
                        autoplay: false,
                        mini: false,
                        miniID: null,
                        buttons: false,
                        resumePlay: true,
                        preload: true,
                        volumeFadeSpeed: 30,
                        countdown: {active: false,
                                style: {
                                        start: '_0',
                                        end: '_100'
                                }
                        },
                        callback: {
                                init: function() {
                                },
                                animationStart: function() {
                                },
                                animationEnd: function() {
                                },
                                play: function() {
                                },
                                stop: function() {
                                },
                                tabFocus: function() {
                                },
                                tabBlur: function() {
                                }
                        },
                        debug: false,
                        //Functional//
                        prev: null,
                        next: null,
                        actual: null,
                        total: null,
                        totalImages: 0,
                        loaded: 0,
                        base: null,
                        started: 0,
                        orientation: null,
                        ratio: null
                }];
        var to = new Array();
        var _actual = new Array();
        var _next = new Array();
        var _baseId = new Array();
        window.FG_video = {};
        window.FG_video_data = {};
        window.FG_video_loaded = false;
        $.getScript('//www.youtube.com/iframe_api');
        //Animation samples
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
                                }
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
                                }
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
                                        actual: {zIndex: 1, display: 'none', top: 0, left: '100%'},
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
                                        actual: {zIndex: 1, display: 'none', top: 0, left: '-100%'},
                                        next: {zIndex: 1, display: 'block', top: 0, left: 0}
                                }
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

//Starter
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
                                case 'resize':
                                        callback = resize;
                                        break;
                        }
                }
                else if (argL == 1 && typeof arguments[0] == 'number')
                {
                        callback = parseInt(arguments[0] * 1);
                        if (options[id].images[callback] != undefined && callback != options[id].actual)
                        {
                                clearTimeout(to[id]);
                                options[id].actual = options[id].actual;
                                options[id].prev = (callback < 0) ? options[id].total - 1 : callback;
                                options[id].next = callback;
                                effect = (options[id].next > options[id].actual) ? 'n' : 'p';
                                animation(id, effect);
                        }
                }

                if (callback)
                {
                        if (typeof callback == 'function')
                        {
                                callback(id);
                        }
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

//Costructor
        var init = function(id)
        {
//Check for right tab visibility value
                if (typeof document.hidden !== "undefined") {
                        enVars.visibilityValue = "hidden";
                        enVars.visibilityChange = "visibilitychange";
                } else if (typeof document.mozHidden !== "undefined") {
                        enVars.visibilityValue = "mozHidden";
                        enVars.visibilityChange = "mozvisibilitychange";
                } else if (typeof document.msHidden !== "undefined") {
                        enVars.visibilityValue = "msHidden";
                        enVars.visibilityChange = "msvisibilitychange";
                } else if (typeof document.webkitHidden !== "undefined") {
                        enVars.visibilityValue = "webkitHidden";
                        enVars.visibilityChange = "webkitvisibilitychange";
                }

//And set a event
                document.addEventListener(enVars.visibilityChange, function() {
                        visibilityChange(id);
                }, false);
                //Set baseId for future refetence
                _baseId[id] = options[id].base;
                _baseId[id] = '#' + _baseId[id].attr('id') + ' ';
                //If no images in the array, check for ul and li inside and write an array
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
                //Check what kind of mini-gallery is setted
                switch (options[id].mini)
                {
                        case 'thumbnails':
                                thumbs_class = 'FG_mini FG_thumb_list';
                                break;
                        case 'numbers':
                                thumbs_class = 'FG_mini FG_number_list';
                                break;
                        default:
                                thumbs_class = 'FG_mini FG_button_list';
                                break;
                }

//Set prev/next buttons if setted
                buttons = '';
                if (options[id].buttons) {
                        buttons = '<ul class="FG_buttons"><li class="prev"></li><li class="next"></li></ul>';
                }

//Set countdown if option true
                countdown = '';
                if (options[id].countdown.active) {
                        countdown = '<div class="FG_countdown"><div class="_0"></div></div>';
                }

//Set thumbs if setted
                thumbs = '<ul class="' + thumbs_class + '" connection="' + id + '">';
                for (i = 0; i < options[id].images.length; i++)
                {
                        z = -3;
                        d = 'none';
                        s = '';
                        if (i == 0) {
                                z = -1;
                                d = 'block';
                                s = 'FG_thumb_list_actual';
                        }

//Set slides
                        if (options[id].images[i].type == 'video')
                        {
                                loop = (options[id].images[i].loop) ? 'loop' : '';
                                controls = (options[id].images[i].controls) ? 'controls' : '';
                                autoplay = (options[id].images[i].autoplay) ? 'autoplay' : '';
                                video = '<video class="FG_video" id="' + id + '_video_' + i + '" image="' + i + '" base="' + id + '" ' + autoplay + ' ' + loop + ' ' + controls + '>';
                                sources = options[id].images[i].url.split(';');
                                for (i = 0; i < sources.length; i++)
                                {
                                        source = sources[i].split('|');
                                        if (source.length == 2)
                                        {
                                                video += '<source src="' + source[0] + '" type="' + source[1] + '">';
                                        }
                                        else
                                        {
                                                video += '<source src="' + sources[i] + '">';
                                        }
                                }
                                video += '</video>';

                                customControls = '<div style="display:' + d + ';" class="FG_video_controls"><ul><li class="play"></li><li class="stop"></li><li class="restart"></li><li class="fadein"></li><li class="fadeout"></li><li class="mute"></li><li class="unmute"></li></ul></div>';
                                $(options[id].base).append('<div video="true" class="FG_image" image="' + i + '" style="z-index:' + z + ';display:' + d + ';">' + video + ((options[id].images[i].content == undefined) ? '' : options[id].images[i].content) + ((options[id].images[i].customControls == true) ? customControls : '') + '</div>');

                                if (i == 0) {
                                        document.getElementById(id + '_video_' + i).onended = function() {
                                                if (options[id].status == 1) {
                                                        $(options[id].base).FullGallery('next');
                                                }
                                        }
                                }
                                document.getElementById(id + '_video_' + i).pause();

                                if (options[id].images[i].customControls != undefined && options[id].images[i].customControls != true && options[id].images[i].customControls != false)
                                {
                                        $(options[id].images[i].customControls).append(customControls);

                                        $(options[id].images[i].customControls).children('.FG_video_controls').children('ul').children('li').click(function() {
                                                $(options[id].base).FullGalleryVideoManager($(this).attr('class'));
                                        });
                                }
                                else if (options[id].images[i].customControls == true)
                                {
                                        $(options[id].base).children('.FG_video_controls').children('ul').children('li').click(function() {
                                                $(options[id].base).FullGalleryVideoManager($(this).attr('class'));
                                        });
                                }

                        }
                        else if (options[id].images[i].type == 'youtube')
                        {
                                url = options[id].images[i].url;
                                if (url.indexOf('watch') >= 0)
                                {
                                        url = url.match(/v=(.*)/);
                                        url = url[1];
                                        url = url.split('&');
                                        url = url[0];
                                }
                                else if (url.indexOf('embed') >= 0)
                                {
                                        url = url.match(/\/embed\/(.*)[\?]*/);
                                        url = url[1];
                                        url = url.split('&');
                                        url = url[0];
                                }
                                options[id].images[i].url = url;
                                FG_video_data[id + '_video_' + i] = {
                                        loop: (options[id].images[i].loop) ? 1 : 0,
                                        controls: (options[id].images[i].controls) ? 1 : 0,
                                        autoplay: (options[id].images[i].autoplay) ? 1 : 0,
                                        info: (options[id].images[i].info) ? 1 : 0,
                                        rel: (options[id].images[i].rel) ? 1 : 0,
                                        list: options[id].images[i].list,
                                        modestbranding: 1,
                                        start: (options[id].images[i].start > 0) ? options[id].images[i].start : '',
                                        end: (options[id].images[i].end > 0) ? options[id].images[i].end : '',
                                        iv_load_policy: (options[id].images[i].annotations) ? '1' : '3',
                                        muted: (options[id].images[i].muted) ? true : false
                                }

                                video = '<div videoID="' + url + '" class="FG_video" id="' + id + '_video_' + i + '" image="' + i + '" base="' + id + '" h="' + options[id].images[i].height + '" w="' + options[id].images[i].width + '" allowfullscreen></div>';

                                customControls = '<div style="display:' + d + ';" class="FG_video_controls"><ul><li class="play"></li><li class="stop"></li><li class="restart"></li><li class="fadein"></li><li class="fadeout"></li><li class="mute"></li><li class="unmute"></li></ul></div>';

                                $(options[id].base).append('<div class="FG_image" video="true" image="' + i + '" style="z-index:' + z + ';display:' + d + ';">' + video + ((options[id].images[i].content == undefined) ? '' : options[id].images[i].content) + ((options[id].images[i].customControls == true) ? customControls : '') + '</div>');

                                if (options[id].images[i].customControls != undefined && options[id].images[i].customControls != true && options[id].images[i].customControls != false)
                                {
                                        $(options[id].images[i].customControls).append(customControls);

                                        $(options[id].images[i].customControls).children('.FG_video_controls').children('ul').children('li').click(function() {
                                                $(options[id].base).FullGalleryVideoManager($(this).attr('class'));
                                        });
                                }
                                else if (options[id].images[i].customControls == true)
                                {
                                        $(options[id].base).children('.FG_video_controls').children('ul').children('li').click(function() {
                                                $(options[id].base).FullGalleryVideoManager($(this).attr('class'));
                                        });
                                }
                                FG_video_data[id + '_video_' + i].customControls = options[id].images[i].customControls;
                        }
                        else
                        {
                                if (options[id].preload && options[id].autoplay)
                                {
                                        $('<img/>').attr('src', options[id].images[i].url).load(function() {
                                                $(this).remove();
                                                log('Preload', id);
                                                options[id].loaded++;
                                                preload(id);
                                        });
                                }
                                options[id].totalImages++;
                                $(options[id].base).append('<div class="FG_image" image="' + i + '" style="z-index:' + z + ';background-image:url(' + options[id].images[i].url + ');display:' + d + ';">' + ((options[id].images[i].content == undefined) ? '' : options[id].images[i].content) + '</div>');
                        }

//Set thumbs if option is true

                        if (options[id].mini != null)
                        {
                                switch (options[id].mini)
                                {
                                        case 'thumbnails':
                                                url = (options[id].images[i].type == 'video') ? '' : options[id].images[i].url;
                                                if (options[id].images[i].type == 'video')
                                                {

                                                        video = document.getElementById(id + '_video_' + i);
                                                        video.addEventListener('loadeddata', function() {
                                                                video.currentTime = 10;
                                                                generateVideoThumbnail(this);
                                                        }, false);
                                                        s += ' FG_thumb_video';
                                                }
                                                else if (options[id].images[i].type == 'youtube')
                                                {
                                                        url = 'http://img.youtube.com/vi/' + options[id].images[i].url + '/1.jpg';
                                                        s += ' FG_thumb_video';
                                                }

                                                thumbs += '<li class="FG_thumb_image ' + s + '" image="' + (i) + '" style="background-image:url(' + url + ');background-size:cover;background-position: center center;"></li>';
                                                break;
                                        case 'numbers':
                                                thumbs += '<li class="FG_thumb_number ' + s + '" image="' + (i) + '" >' + (i + 1) + '</li>';
                                                break;
                                        default:
                                                thumbs += '<li class="FG_thumb_button ' + s + '" image="' + (i) + '"></li>';
                                                break;
                                }
                        }
                }
                thumbs += '</ul>';
                append = ((options[id].buttons) ? buttons : '') + ((options[id].mini !== false && options[id].miniID == null) ? thumbs : '') + ((options[id].countdown.active !== false) ? countdown : '');
                $(options[id].base).prepend(append);
                if (options[id].mini !== false && options[id].miniID != null && $(options[id].miniID).length == 1)
                {
                        $(options[id].miniID).attr({connection: id});
                        $(options[id].miniID).append(thumbs);
                        that = this;
                        $(options[id].miniID + ' > ul.FG_mini > li').click(function() {
                                if (!$($(options[id].miniID).attr('connection') + ' > .FG_image').is(':animated'))
                                {
                                        log('No animation, start animating', id);
                                        img = $(this).attr('image') * 1;
                                        img = (img >= options[id].images.length) ? 0 : img;
                                        img = (img < 0) ? options[id].images.length - 1 : img;
                                        $('#' + $(options[id].miniID).attr('connection')).FullGallery(img);
                                }
                        });
                }
                else
                {
                        $(_baseId[id] + ' > ul.FG_mini > li').click(function() {
                                if (!$(_baseId[id] + ' > .FG_image').is(':animated'))
                                {
                                        log('No animation, start animating', id);
                                        img = $(this).attr('image') * 1;
                                        img = (img >= options[id].images.length) ? 0 : img;
                                        img = (img < 0) ? options[id].images.length - 1 : img;
                                        $(options[id].base).FullGallery(img);
                                }
                        });
                }


//Set actions
                $(_baseId[id] + ' > ul.FG_buttons > li.prev').click(function() {
                        $(options[id].base).FullGallery('prev');
                });
                $(_baseId[id] + ' > ul.FG_buttons > li.next').click(function() {
                        $(options[id].base).FullGallery('next');
                });
                //Save gallery statistics
                options[id].actual = 0;
                options[id].total = i;
                options[id].prev = i - 1;
                options[id].next = 1;
                log(options[id], id);
                //On resize, resize videos
                $(options[id].base).FullGallery('resize');
                $(window).resize(function() {
                        $(options[id].base).FullGallery('resize');
                });

                //If autoplay set true
                if (options[id].autoplay) {
                        log('Autoplay', id);
                        if (!options[id].preload)
                        {
                                log('No preload', id);
                                options[id].status = 1;
                                time = options[id].time;
                                if ((options[id].images[0].type == 'youtube' || options[id].images[0].type == 'video') && (options[id].images[0].adaptTime))
                                {
                                        if (options[id].images[0].type == 'video')
                                        {
                                                video = document.getElementById(id + '_video_0').onended = function() {
                                                        $(options[id].base).FullGallery('next');
                                                }
                                        }
                                }
                                else
                                {
                                        if (options[id].total > 1)
                                        {
                                                cDown(id, true, time);
                                        }
                                        to[id] = setTimeout(function() {
                                                play(id);
                                        }, time);
                                }
                        }

                }

                if (typeof options[id].callback.init == 'function')
                {
                        options[id].callback.init();
                }
        }

//Stop the auto-slide
        var stop = function(id) {
                options[id].status = 0;
                clearTimeout(to[id]);
                if (typeof options[id].callback.stop == 'function')
                {
                        options[id].callback.stop();
                }
        }

//Play the autoslide
        var play = function(id) {
                options[id].status = 1;
                if (typeof options[id].callback.play == 'function')
                {
                        options[id].callback.play();
                }

                if (options[id].images[options[id].actual].type == 'youtube')
                {
                        if (FG_video_data[id + '_video_' + options[id].actual].status == 0)
                        {
                                animation(id, options[id].animation, 'n');
                        }
                }
                else
                {
                        animation(id, options[id].animation, 'n');
                }
        }

//Go to the next slide
        var next = function(id) {
                if (!$(_baseId[id] + ' > .FG_image').is(':animated'))
                {
                        clearTimeout(to[id]);
                        animation(id, 'n');
                }
        }

//Go to the prev slide
        var prev = function(id) {
                if (!$(_baseId[id] + ' > .FG_image').is(':animated'))
                {
                        clearTimeout(to[id]);
                        animation(id, 'p');
                }
        }

//Animation function
        var animation = function(id, PoN) {
                log('Start animation function', id);
                if (options[id].total > 1)
                {
                        log('More then 1 image', id);
                        if (typeof options[id].callback.animationStart == 'function')
                        {
                                options[id].callback.animationStart();
                        }
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
                                options[id].prev = (options[id].actual - 1 < 0) ? options[id].total - 1 : options[id].actual - 1;
                                options[id].next = (options[id].actual + 1 > options[id].total - 1) ? 0 : options[id].actual + 1;
                        }
                        else
                        {
                                _actual[id] = options[id].actual;
                                _next[id] = options[id].next;
                                options[id].actual = options[id].next;
                                options[id].prev = (options[id].actual - 1 < 0) ? options[id].total - 1 : options[id].actual - 1;
                                options[id].next = (options[id].actual + 1 > options[id].total - 1) ? 0 : options[id].actual + 1;
                        }

                        if (options[id].images[_next[id]].type == 'youtube') {
                                onYouTubeIframeAPIReady(true, id, _next[id]);
                        }
                        if (options[id].images[_next[id]].type == 'video')
                        {
                                document.getElementById(id + '_video_' +  _next[id]).play();
                                document.getElementById(id + '_video_' +  _next[id]).onended = function() {
                                        if (options[id].status == 1) {
                                                $(options[id].base).FullGallery('next');
                                        }
                                }
                        }

                        log(options[id].prev + ' < ' + options[id].actual + ' > ' + options[id].next, id);
                        if (sA.before.actual != null) {
                                $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').css(sA.before.actual);
                                log('Before set actual', id);
                                if (typeof sAc.callbacks.before == 'function')
                                {
                                        sAc.callbacks.before('actual', _actual[id]);
                                }
                                resize(id);
                        }
                        if (sA.before.next != null) {
                                $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').css(sA.before.next);
                                log('Before set next', id);
                                if (typeof sAc.callbacks.before == 'function')
                                {
                                        sAc.callbacks.before('next', _next[id]);
                                }
                                resize(id);
                        }

                        if (sA.actualImageTo != null) {
                                log('Actual animation start', id);
                                $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').animate(sA.actualImageTo.css, sA.actualImageTo.time, sA.actualImageTo.method, function() {
                                        if (!sAc.sync && sA.nextImageTo != null)
                                        {
                                                log('Sync false', id);
                                                log('Next animation start', id);
                                                $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').animate(sA.nextImageTo.css, sA.nextImageTo.time, sA.nextImageTo.method, function() {
                                                        log('After set acutal', id);
                                                        $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').css(sA.after.actual);
                                                        if (typeof sAc.callbacks.after == 'function')
                                                        {
                                                                sAc.callbacks.after('actual', _actual[id]);
                                                        }
                                                        log('After set next', id);
                                                        $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').css(sA.after.next);
                                                        if (typeof sAc.callbacks.after == 'function')
                                                        {
                                                                sAc.callbacks.after('next', _next[id]);
                                                        }
                                                });
                                                log('Next animation end', id);
                                        }
                                        else
                                        {
                                                log('Sync true', id);
                                                log('After set acutal', id);
                                                $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').css(sA.after.actual);
                                                if (typeof sAc.callbacks.after == 'function')
                                                {
                                                        sAc.callbacks.after('actual', _actual[id]);
                                                }
                                        }
                                });
                                log('Actual animation end', id);
                        }
                        if (sA.nextImageTo != null)
                        {
                                log('Sync false', id);
                                log('Next animation start', id);
                                if (sA.delay > 0)
                                {
                                        $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').delay(sA.delay).animate(sA.nextImageTo.css, sA.nextImageTo.time, sA.nextImageTo.method, function() {

                                                if (!sAc.sync)
                                                {
                                                        log('After set acutal', id);
                                                        $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').css(sA.after.actual);
                                                        if (typeof sAc.callbacks.after == 'function')
                                                        {
                                                                sAc.callbacks.after('actual', _actual[id]);
                                                        }
                                                }

                                                log('After set next', id);
                                                $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').css(sA.after.next);
                                                if (typeof sAc.callbacks.after == 'function')
                                                {
                                                        sAc.callbacks.after('next', _next[id]);
                                                }
                                                resize(id);
                                        });
                                        resize(id);
                                        log('Next animation end', id);
                                        $(options[id].base).children('div.FG_image').removeClass('actual');
                                        $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').addClass('actual');
                                }
                                else
                                {
                                        $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').animate(sA.nextImageTo.css, sA.nextImageTo.time, sA.nextImageTo.method, function() {

                                                if (!sAc.sync)
                                                {
                                                        log('After set acutal', id);
                                                        $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').css(sA.after.actual);
                                                        if (typeof sAc.callbacks.after == 'function')
                                                        {
                                                                sAc.callbacks.after('actual', _actual[id]);
                                                        }
                                                }

                                                log('After set next', id);
                                                $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').css(sA.after.next);
                                                if (typeof sAc.callbacks.after == 'function')
                                                {
                                                        sAc.callbacks.after('next', _next[id]);
                                                }
                                                resize(id);
                                        });
                                        resize(id);
                                        log('Next animation end', id);
                                        $(options[id].base).children('div.FG_image').removeClass('actual');
                                        $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').addClass('actual');
                                }
                        }

                        if (options[id].images[_next[id]].customControls != undefined && options[id].images[_next[id]].customControls != false && (options[id].images[_actual[id]].customControls == undefined || options[id].images[_actual[id]].customControls != false)) {
                                if (options[id].images[_next[id]].customControls == true)
                                {
                                        $(options[id].base).children('div.FG_video_controls').fadeIn();
                                }
                                else
                                {
                                        $(options[id].images[_next[id]].customControls).children('div.FG_video_controls').fadeIn();
                                }
                        }
                        else if (options[id].images[_actual[id]].customControls != undefined && options[id].images[_actual[id]].customControls != false && (options[id].images[_next[id]].customControls == undefined || options[id].images[_next[id]].customControls != false))
                        {
                                if (options[id].images[_next[id]].customControls == true)
                                {
                                        $(options[id].base).children('div.FG_video_controls').fadeOut();
                                }
                                else
                                {
                                        $(options[id].images[_actual[id]].customControls).children('div.FG_video_controls').fadeOut();
                                }
                        }

                        if (typeof jQuery.ui !== 'undefined')
                        {
                                time = (sA.actualImageTo != null && sA.nextImageTo != null) ? sA.actualImageTo.time * 1 + sA.nextImageTo.time * 1 : 1000;
                                base = (options[id].miniID != null) ? options[id].miniID : options[id].base;
                                $(base).children('.FG_mini').children('li').removeClass('FG_thumb_list_actual', time);
                                $(base).children('.FG_mini').children('li[image="' + _next[id] + '"]').addClass('FG_thumb_list_actual', time);
                        }
                        else
                        {
                                base = (options[id].miniID != null) ? options[id].miniID : options[id].base;
                                $(base).children('.FG_mini').children('li').removeClass('FG_thumb_list_actual');
                                $(base).children('.FG_mini').children('li[image="' + _next[id] + '"]').addClass('FG_thumb_list_actual');
                        }
                        if (options[id].status == 1) {
                                if ((options[id].images[_next[id]].type == 'youtube' || options[id].images[_next[id]].type == 'video') && options[id].images[_next[id]].adaptTime)
                                {

                                }
                                else
                                {
                                        cDown(id, true);
                                        to[id] = setTimeout(function() {
                                                animation(id, 'n');
                                        }, options[id].time);
                                }
                        }

                        if (typeof options[id].callback.animationEnd == 'function')
                        {
                                options[id].callback.animationEnd();
                        }

                        if ($(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').children('video').length > 0)
                        {
                                videoId = $(options[id].base).children('div.FG_image[image="' + _next[id] + '"]').children('video').attr('id');
                                document.getElementById(videoId).play();
                        }

                        if ($(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').children('video').length > 0)
                        {
                                videoId = $(options[id].base).children('div.FG_image[image="' + _actual[id] + '"]').children('video').attr('id');
                                document.getElementById(videoId).pause();
                        }
                }
                else {
                        log('Just 1 image', id);
                }
        }

//Logging function
        var log = function(msg, id)
        {
                if (options[id].debug)
                {
                        console.log(msg);
                }
        }

//Tab change function calback
        var visibilityChange = function(id) {
                if (options[id].status != null)
                {
                        if (document[enVars.visibilityValue] && options[id].status == 1)
                        {
                                log('Visibility change HIDE', id);
                                $(options[id].base).FullGallery('stop');
                                if (typeof options[id].callback.tabBlur == 'function')
                                {
                                        options[id].callback.tabBlur();
                                }
                        }
                        else if (options[id].status == 0 && options[id].resumePlay == true)
                        {
                                log('Visibility change SHOW', id);
                                $(options[id].base).FullGallery('play');
                                if (typeof options[id].callback.tabFocus == 'function')
                                {
                                        options[id].callback.tabFocus();
                                }
                        }
                }
        }

//Countdown graphic manager
        var cDown = function(id, r, time) {
                time = (time * 1 > 0) ? time : options[id].time;
                if (options[id].countdown.active && options[id].autoplay && options[id].status == 1)
                {
                        if (r)
                        {
                                $(options[id].base).children('.FG_countdown').children('div').stop(true, true);
                        }

                        if (typeof jQuery.ui !== 'undefined')
                        {
                                if (typeof options[id].countdown.style.start == 'string')
                                {
                                        $(options[id].base).children('.FG_countdown').children('div').addClass(options[id].countdown.style.end, time, function() {
                                                $(this).removeClass(options[id].countdown.style.end);
                                        });
                                }
                                else if (typeof options[id].countdown.style.start == 'object')
                                {
                                        $(options[id].base).children('.FG_countdown').children('div').animate(options[id].countdown.style.end, time, function() {
                                                $(this).css(options[id].countdown.style.start);
                                        });
                                }
                                else
                                {
                                        $(options[id].base).children('.FG_countdown').children('div').addClass('_100', time, function() {
                                                $(this).removeClass('_100');
                                        });
                                }
                        }
                        else
                        {
                                $(options[id].base).children('.FG_countdown').children('div').animate(options[id].countdown.style.end, time, function() {
                                        $(this).css(options[id].countdown.style.start);
                                });
                        }

                }
        }

//Wait all images to load before play the slideshow
        var preload = function(id) {
                log(' ', id);
                if (options[id].totalImages == options[id].loaded)
                {
                        log('Play', id);
                        to[id] = setTimeout(function() {
                                play(id)
                        }, options[id].time);
                }
        }

//Video resize function
        var resize = function(id) {

                $(options[id].base).children('div.FG_image').children('video').each(function() {

                        h = $(options[id].base).height();
                        w = $(options[id].base).width();
                        o = (w > h) ? 'o' : 'v';
                        r = (o != 'o') ? w / h : h / w;
                        options[id].orientation = o;
                        options[id].ratio = r;
                        if (o == 'o')
                        {
                                vH = 'auto';
                                vW = '100%';
                                $(this).attr({height: vH, width: vW});
                                if ($(this).height() <= h) {
                                        vH = '100%';
                                        vW = 'auto';
                                }
                        }
                        else
                        {
                                vH = '100%';
                                vW = 'auto';
                                $(this).attr({height: vH, width: vW});
                                if ($(this).width() <= w)
                                {
                                        vH = 'auto';
                                        vW = '100%';
                                }
                        }

                        $(this).attr({height: vH, width: vW});
                });
                $(options[id].base).children('div.FG_image').children('iframe').each(function() {

                        hC = $(options[id].base).height();
                        wC = $(options[id].base).width();
                        oC = (wC > hC) ? 'o' : 'v';
                        rC = (oC != 'o') ? wC / hC : hC / wC;
                        options[id].orientation = oC;
                        options[id].ratio = rC;
                        h = $(this).attr('h');
                        w = $(this).attr('w');
                        o = (w > h) ? 'o' : 'v';
                        r = (oC != 'o') ? w / h : h / w;
                        if (oC == 'o')
                        {
                                vH = wC * r;
                                vW = wC;
                                $(this).attr({height: vH, width: vW});
                                if ($(this).height() <= hC) {
                                        r = w / h;
                                        vH = hC;
                                        vW = hC * r;
                                }
                        }
                        else
                        {
                                vH = hC;
                                vW = hC * r;
                                $(this).attr({height: vH, width: vW});
                                if ($(this).width() <= wC)
                                {
                                        vH = wC * r;
                                        vW = wC;
                                }
                        }

                        $(this).attr({height: vH, width: vW});
                });
        }

//Thumb generation for html5 video
        var generateVideoThumbnail = function(videoID) {
                thumb = $(videoID).attr('image');
                id = $(videoID).attr('base');
                canvas = document.createElement('canvas');
                canvas.width = videoID.videoWidth;
                canvas.height = videoID.videoHeight;
                context = canvas.getContext('2d');
                context.drawImage(videoID, 0, 0, videoID.videoWidth, videoID.videoHeight);
                dataURL = canvas.toDataURL();
                base = (options[id].miniID != null) ? options[id].miniID : options[id].base;
                $(base).children('ul').children('li[image="' + thumb + '"]').css({background: 'url(' + dataURL + ')', 'background-size': 'cover'});
        }

//Extends actual animation object
        $.fn.FullGalleryAnimations = function(animationsLoaded)
        {
                animations = $.extend(animationsLoaded, animations);
        }

//Return gallery option object
        $.fn.FullGalleryGetOptions = function()
        {
                var id = $(this).attr('id');
                id = (id == '' || id == undefined) ? 'FG' + Math.round(Math.random() * 10000000) : id;
                $(this).attr({'id': id});
                return options[id];
        }

//Video Management
        $.fn.FullGalleryVideoManager = function(action, i)
        {
                var id = $(this).attr('id');

                switch (action)
                {
                        case 'play':
                                if (options[id].images[options[id].actual].type == 'youtube')
                                {
                                        FG_video[id + '_video_' + options[id].actual].playVideo();
                                }
                                else
                                {
                                        document.getElementById(id + '_video_' + options[id].actual).play();
                                }
                                break;
                        case 'stop':
                                if (options[id].images[options[id].actual].type == 'youtube')
                                {
                                        FG_video[id + '_video_' + options[id].actual].stopVideo();
                                }
                                else
                                {
                                        document.getElementById(id + '_video_' + options[id].actual).pause();
                                }
                                break;
                        case 'restart':
                                if (options[id].images[options[id].actual].type == 'youtube')
                                {
                                        onYouTubeIframeAPIReady(true);
                                }
                                else
                                {
                                        document.getElementById(id + '_video_' + options[id].actual).load();
                                }
                                break;
                        case 'mute':
                                if (options[id].images[options[id].actual].type == 'youtube')
                                {
                                        FG_video[id + '_video_' + options[id].actual].mute();
                                }
                                else
                                {
                                        document.getElementById(id + '_video_' + options[id].actual).muted = true;
                                }
                                break;
                        case 'unmute':
                                if (options[id].images[options[id].actual].type == 'youtube')
                                {
                                        FG_video[id + '_video_' + options[id].actual].unMute();
                                }
                                else
                                {
                                        document.getElementById(id + '_video_' + options[id].actual).muted = false;
                                }
                                break;
                        case 'fadein':
                                if (options[id].images[options[id].actual].type == 'youtube')
                                {
                                        VideoFadeVolume(id, 'in', FG_video[id + '_video_' + options[id].actual].getVolume());
                                }
                                else
                                {
                                        VideoFadeVolume(id, 'in', document.getElementById(id + '_video_' + options[id].actual).volume);
                                }
                                break;
                        case 'fadeout':
                                if (options[id].images[options[id].actual].type == 'youtube')
                                {
                                        VideoFadeVolume(id, 'out', FG_video[id + '_video_' + options[id].actual].getVolume());
                                }
                                else
                                {
                                        VideoFadeVolume(id, 'out', document.getElementById(id + '_video_' + options[id].actual).volume);
                                }
                                break;
                        case 'setvolume':
                                if (options[id].images[options[id].actual].type == 'youtube')
                                {
                                        FG_video[id + '_video_' + options[id].actual].setVolume(i);
                                }
                                else
                                {
                                        document.getElementById(id + '_video_' + options[id].actual).volume = i / 100;
                                }
                                break;
                }
        }

        VideoFadeVolume = function(id, action, i)
        {
                if (action == 'in') {
                        i++;
                }
                else {
                        i--;
                }

                if (i >= 0 && i <= 100)
                {
                        setTimeout(function() {
                                $('#' + id).FullGalleryVideoManager('setvolume', i);
                                VideoFadeVolume(id, action, i);
                        }, options[id].volumeFadeSpeed);
                }
        }

})(jQuery);
//Manage youtube.ready function
window.onYouTubeIframeAPIReady = function(write, id, i) {

        if (write === true || FG_video_loaded == false)
        {
                id_v = (id != '' && id != undefined) ? '#' + id + ' .div[videoID][image="' + i + '"],#' + id + ' .iframe[videoID][image="' + i + '"]' : 'div[videoID],iframe[videoID]';

                $(id_v).each(function() {
                        console.log('Div/Iframe');
                        html = $(this).parent('div').html();
                        html = html.replace('iframe', 'div');
                        $(this).parent('div').html(html);
                        id = $(this).attr('base');
                        i = $(this).attr('image');
                        url = $(this).attr('videoID');
                        h = $(this).attr('h');
                        w = $(this).attr('w');
                        loop = FG_video_data[id + '_video_' + i].loop;
                        muted = FG_video_data[id + '_video_' + i].muted;
                        console.log('Mut: ' + muted);
                        opt = FG_video_data[id + '_video_' + i];
                        FG_video[id + '_video_' + i] = new YT.Player(id + '_video_' + i, {
                                width: w,
                                height: h,
                                videoId: url,
                                playerVars: opt,
                                events: {
                                        'onReady': function(e) {
                                                FG_video_loaded = true;
                                                $('#' + id).FullGallery('resize');
                                                FG_video_data[id + '_video_' + i].duration = e.target.getDuration();
                                                FG_video_data[id + '_video_' + i].status = 0;
                                                console.log('Mut: ' + muted);
                                                if (muted)
                                                {
                                                        e.target.mute();
                                                }
                                        },
                                        'onStateChange': function(e) {
                                                var options = $('#' + id).FullGalleryGetOptions();
                                                FG_video_data[id + '_video_' + i].status = e.data;
                                                loop = options.images[$(e.target.a).attr('image')].loop;

                                                if (e.data == YT.PlayerState.ENDED && loop == 1)
                                                {
                                                        e.target.playVideo();
                                                }
                                                else if (e.data == YT.PlayerState.ENDED && loop == 0 && options.status == 1)
                                                {
                                                        $('#' + id).FullGallery('next');
                                                }
                                        }
                                }
                        });
                });
        }
}