/* FullGallery v0.3 Responsive multi-Gallery with thumbinals, customizable transiction and content slideshow License: This work is licensed under the Creative Commons Attribution 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA. Contacts: digitald(at)big-d-web(dot)com */
var animations = {
        fadeZoom: {
                forward: {
                        before: {
                                actual: {zIndex: -2, display: 'block', opacity: '1.0'},
                                next: {zIndex: -1, display: 'block', opacity: '0.0', width: '2%', height: '2%', top: '49%', left: '49%'}
                        },
                        actualImageTo: null,
                        delay: 0,
                        nextImageTo: {css: {display: 'block', opacity: '1.0', width: '100%', height: '100%', top: '0', left: '0'}, time: 1000, method: 'easeInOutExpo'},
                        after: {
                                actual: {zIndex: -3, display: 'none', opacity: '0.0'},
                                next: {zIndex: -1, display: 'block'}
                        }
                },
                previous: {
                        before: {
                                actual: {zIndex: -2, display: 'block', opacity: '1.0'},
                                next: {zIndex: -1, display: 'block', opacity: '0.0', width: '2%', height: '2%', top: '49%', left: '49%'}
                        },
                        actualImageTo: null,
                        delay: 0,
                        nextImageTo: {css: {display: 'block', opacity: '1.0', width: '100%', height: '100%', top: '0', left: '0'}, time: 1000, method: 'easeInOutExpo'},
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
        slideUp: {
                forward: {
                        before: {
                                actual: {zIndex: 1, display: 'block', left: 0, top: 0},
                                next: {zIndex: 2, display: 'block', left: 0, top: '100%'}
                        },
                        actualImageTo: {css: {top: '-100%'}, time: 1200, method: 'easeInOutExpo'},
                        delay: 0,
                        nextImageTo: {css: {top: '0'}, time: 1000, method: 'easeInOutExpo'},
                        after: {
                                actual: {zIndex: 1, display: 'none', left: 0, top: '-100%'},
                                next: {zIndex: 1, display: 'block', left: 0, top: 0}
                        }
                },
                previous: {
                        before: {
                                actual: {zIndex: 1, display: 'block', left: 0, top: 0},
                                next: {zIndex: 2, display: 'block', left: 0, top: '100%'}
                        },
                        actualImageTo: {css: {top: '-100%'}, time: 1200, method: 'easeInOutExpo'},
                        delay: 0,
                        nextImageTo: {css: {top: '0'}, time: 1000, method: 'easeInOutExpo'},
                        after: {
                                actual: {zIndex: 1, display: 'none', left: 0, top: '-100%'},
                                next: {zIndex: 1, display: 'block', left: 0, top: 0}
                        }
                },
                sync: true,
                callbacks: {
                        before: function() {
                        },
                        after: function() {
                        }
                }
        },
        slideDown: {
                forward: {
                        before: {
                                actual: {zIndex: 1, display: 'block', left: 0, top: 0},
                                next: {zIndex: 2, display: 'block', left: 0, top: '-100%'}
                        },
                        actualImageTo: {css: {top: '100%'}, time: 1200, method: 'easeInOutExpo'},
                        delay: 0,
                        nextImageTo: {css: {top: '0'}, time: 1000, method: 'easeInOutExpo'},
                        after: {
                                actual: {zIndex: 1, display: 'none', left: 0, top: '100%'},
                                next: {zIndex: 1, display: 'block', left: 0, top: 0}
                        }
                },
                previous: {
                        before: {
                                actual: {zIndex: 1, display: 'block', left: 0, top: 0},
                                next: {zIndex: 2, display: 'block', left: 0, top: '100%'}
                        },
                        actualImageTo: {css: {top: '-100%'}, time: 1200, method: 'easeInOutExpo'},
                        delay: 0,
                        nextImageTo: {css: {top: '0'}, time: 1000, method: 'easeInOutExpo'},
                        after: {
                                actual: {zIndex: 1, display: 'none', left: 0, top: '-100%'},
                                next: {zIndex: 1, display: 'block', left: 0, top: 0}
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

$().FullGalleryAnimations(animations);
