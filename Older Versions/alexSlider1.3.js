(function ($) {
    $.fn.Slider = function (options) {
        var defaults = {
            prevBtnClass: 'prevBtn',
            prevBtnText: 'Previous',
            nextBtnClass: 'nextBtn',
            nextBtnText: 'Next',
			playBtnText: 'Play',
			pauseBtnText: 'Pause',
			playBtnClass: 'playBtn',
			pauseBtnClass: 'pauseBtn',
            showControls: true,
            speed: 600,
            auto: true,
            pause: 8000,
            width: -1,
            continuous: true,
            overedge: false,
            autoresize: false,
            navigation: false,
            counter: false,
            fadeEffect: false,
            disableOnClick: true,
			playPause: true,
			timeToStartPlay : 0
        };

        var options = $.extend(defaults, options);

        this.each(function () {			
            var s;
            var currentItemIndex = 1;
            var doOverEdge;
            var indexOfActiveTag = 1;
            var leftright;
            var animationStarted = false;
            var obj = $(this);
            var initialization = $(obj).hasClass('initialized');
            var totalItems;
            var disablePrevious = false;
            var disableNext = false;
            var disableAutoForce = false;
            var nextButtonSelector = 'span.' + options.nextBtnClass + ' a';
            var previousButtonSelector = 'span.' + options.prevBtnClass + ' a';
			var playButtonSelector = 'span.' + options.playBtnClass;
			var pauseButtonSelector = 'span.' + options.pauseBtnClass;
            var itemsInSlider;
			var timeout;

			if (options.playPause) {
				options.auto = false;
			}
			
            function setHeightOfActiveTag(pos, stopAnimation) {
                if (options.autoresize) {
                    if (stopAnimation) {
                        $(obj).height($($('ul:first > li', obj)[pos]).height());
                    }
                    var newHeight = $($('ul:first > li', obj)[pos]).height();
                    $(obj).animate(
						{ height: newHeight + 10 },
						options.speed * 3 / 4);

                }
            }

            if (options.overedge) {
                doOverEdge = 1;
            } else {
                doOverEdge = 0;
            }

            if (!initialization) {
                $(obj).addClass('initialized');

                var counter = 1;
                $('ul:first > li', obj).each(function () {
                    $(this).addClass('tagorder-' + counter);
                    counter++;
                });


                itemsInSlider = s = $('ul:first > li', obj).length;
                var w = $('ul:first > li', obj).width();

                if ($('ul:first > li img', obj).length) {
                    $('ul:first > li img', obj).each(function () {
                        $($('ul:first > li img', obj)[0]).load(function () {
                            var h = $('ul:first > li', obj).height();
                            if ($(obj).height < h) {
                                $(obj).height(h);
                            }
                        });
                    });
                } else {
                    var h = $('ul:first li', obj).height();
                    $(obj).height(h);
                }

                h += 10;
                if (options.width !== -1) {
                    w = options.width;
                    $('ul:first > li', obj).width(w);
                    $('ul:first > li > img', obj).width(w);
                }

                if (options.showControls && s != 1) {
                    var html = ' <span class="' + options.prevBtnClass + '"><a href=\"javascript:void(0);\"';

                    if (!options.continuous) {
                        html += 'class="disabled"';
                    }
                    html += ' >' + options.prevBtnText + '</a></span>';
                    html += ' <span class="' + options.nextBtnClass + '"><a href=\"javascript:void(0);\">' + options.nextBtnText + '</a></span>';
                    $(obj).append(html);
                };
				
				if (options.playPause && s != 1) {
					var html = ' <span class="' + options.playBtnClass + '"><a href=\"javascript:void(0);\"';
                    
                    html += ' >' + options.playBtnText + '</a></span>';
                    html += ' <span class="' + options.pauseBtnClass + '"><a href=\"javascript:void(0);\">' + options.pauseBtnText + '</a></span>';
                    $(obj).append(html);					
				}
				
				if (options.playPause) {
					$(pauseButtonSelector, obj).hide();
					
					$(playButtonSelector, obj).click(function () {
						$(playButtonSelector, obj).hide();
                        $(pauseButtonSelector, obj).show();
						options.auto = true;
						setTimeout(function () {
							animate('next', false);
					}, options.timeToStartPlay);	
                    });
					
					$(pauseButtonSelector, obj).click(function () {
						$(pauseButtonSelector, obj).hide();
                        $(playButtonSelector, obj).show();
						options.auto = false;	
						clearTimeout(timeout);
                    });
				}

                if (options.showControls) {
                    $(nextButtonSelector, obj).click(function () {
                        if (!$(this).hasClass("disabled")) {
                            animate('next', true, false);
                        }
                    });

                    $(previousButtonSelector, obj).click(function () {
                        if (!$(this).hasClass("disabled")) {
                            animate('prev', true, false);
                        }
                    });
                }

                if (options.counter) {
                    html = '<p class="sliderInfo"> 1 of ' + s + '</p>';
                    $(obj).after(html);
                }

                totalItems = s;

                if (options.navigation && s > 1) {
                    var csscalss = '';
                    html = '<div class="navigation-controls">';
                    html += '<ul class="thumbNav">';
                    for (var i = 0; i < s; i++) {
                        if (i == 0) {
                            cssclass = (i + 1) + ' cur';
                        } else {
                            cssclass = (i + 1) + '';
                        }

                        html += '<li><a href="javascript:;" class="tagorder-' + cssclass + '"><span>' + (i + 1) + '</span></a></li>';
                    }

                    html += '</ul>';
                    html += '</div>';
                    $(obj).append(html);
                }

                h += 100;
                obj.height(h);
                obj.css("overflow", "hidden");
                var t = Math.ceil(s / 2);
                $('ul:first', obj).height(h);
                $('ul:first > li', obj).height(h);
                var counterT = t;
                if (s > 2) {
                    if (s % 2 == 0) {
                        counterT++;
                    }

                    for (var i = 0; i < counterT; i++) {
                        $('ul:first > li:first', obj).wrap('<ul class="wrapping">');
                        var litag = $('ul.wrapping', obj).html();
                        $('ul.wrapping', obj).remove();
                        $('ul:first', obj).append(litag);
                    };

                    if (!options.fadeEffect) {
                        $('ul:first', obj).css('margin-left', (t - 1) * w * -1 + 'px');
                    }
                }

                if (s == 2) {
                    s = 4;
                    if (options.fadeEffect) {
                        t = counterT = 2;
                    } else {
                        t = counterT = 3;
                    }

                    var litag = $('ul:first', obj).html();
                    $('ul:first', obj).append(litag);
                }

                var ts = s - 1;
                var p = ((t - 1) * w * -1);

                if (options.fadeEffect) {
                    $('ul:first', obj).css('width', w);
                    $('ul:first > li', obj).css('position', 'absolute');
                    $('ul:first > li', obj).hide();
                    $($('ul:first > li', obj)[t - 1]).show();
                } else {
                    $('ul:first', obj).css('width', s * w);
                    $('ul:first > li', obj).css('float', 'left');
                }

                $('ul.thumbNav li a', obj).click(function () {
                    if (!$(this).hasClass('cur')) {
                        if (!animationStarted) {
                            animationStarted = true;
                            var previous = $('ul.thumbNav li a.cur', obj);
                            $('ul.thumbNav li a', obj).removeClass('cur');
                            var previousItem = $(previous).attr('class');
                            var selectedItem = $(this).attr('class');

                            var cssClass = $(this).attr('class');
                            currentItemIndex = parseInt(cssClass.split('tagorder-')[1]);
                            checkContinous();

                            $(this).addClass('cur');
                            var selectedIndex = $('ul:first > li.' + selectedItem, obj).index();
                            var difference = selectedIndex - (t - 1);
                            var nextDirection = difference > 0 ? true : false;
                            var differ = difference;
                            difference = Math.abs(difference);

                            for (var i = 0; i < difference; i++) {
                                setTags(nextDirection);
                            }

                            if (options.autoresize) {
                                setHeightOfActiveTag(t - 1);
                            }

                            animate('none', false, true);

                            if (options.fadeEffect) {
                                $('ul:first li.' + previousItem, obj).fadeOut(options.speed);
                                $($('ul:first li', obj)[t - 1]).fadeIn(options.speed, function () {
                                    animationStarted = false;
                                });
                            } else {
                                $('ul:first', obj).css('margin-left', p + differ * w);
                                $('ul:first', obj).animate(
							{ marginLeft: p + (doOverEdge * nextDirection * p / 8) },
							options.speed, function () {
							    animationStarted = false;
							});
                            }
                        }
                    }
                });

                if (options.autoresize) {
                    setHeightOfActiveTag(t - 1, true);
                }

                function animate(direction, clicked, disableClick) {
                    if (!disableClick) {						
                        if (s != 1 && !animationStarted) {
                            animationStarted = true;
                            switch (direction) {
                                case "next":
                                    leftright = 1;
                                    ot = t - 1;
                                    setTags(true, ot);
                                    setHeightOfActiveTag(ot);
                                    break;
                                case "prev":
                                    leftright = 0 - 1;
                                    var ot = t + 1;
                                    setTags(false, t - 1);
                                    setHeightOfActiveTag(t - 1);
                                    break;
                                default:									
                                    break;
                            };
							
							if (options.navigation) {
								var selector = $($('ul:first > li', obj)[t - 1]).attr('class');
								$('ul.thumbNav li a', obj).each(function () {
									if ($(this).hasClass(selector)) {
										$(this).addClass('cur');
									} else {
										$(this).removeClass('cur');
									}
								});
							}

							if (options.fadeEffect) {
								$($('ul:first > li', obj)[ot - 1]).fadeOut(options.speed);
								$($('ul:first > li', obj)[t - 1]).fadeIn(options.speed, function () {
									animationStarted = false;
								});
							} else {
								$('ul:first', obj).css('margin-left', (ot - 1) * w * -1 + 'px');
								$('ul:first', obj).animate(
								{ marginLeft: p + (doOverEdge * leftright * p / 8) },
									options.speed,
									function () {
										if (options.overedge) {
											$('ul:first', obj).animate(
												{ marginLeft: p },
													options.speed / 3, function () {
														animationStarted = false;
													});
										} else {
											animationStarted = false;
										}
									}
								);
							}							
                        }
                    }

                    if (clicked || disableClick) {
                        clearTimeout(timeout);
                        if (!options.disableOnClick && !disableAutoForce) {
                            timeout = setTimeout(function () {
                                animate('next', false, false);
                            }, options.speed + options.pause);
                        }
                    }

                    if (options.auto && direction == 'next' && !clicked) {
                        timeout = setTimeout(function () {
                            animate('next', false, false);
                        }, options.speed + options.pause);
                    };
                };

                function setTags(isNext, ot) {
                    var tagPosition = isNext ? 'first' : 'last';
                    $('ul:first > li:' + tagPosition, obj).wrap("<ul class='wrapping'>");
                    var litag = $('ul.wrapping', obj).html();
                    $('ul.wrapping', obj).remove();
                    if (isNext) {
                        $('ul:first', obj).append(litag);
                    } else {
                        $('ul:first > li:first', obj).before(litag);
                    }

                    if (ot != null) {
                        var cssClass = $($('ul:first > li', obj)[ot]).attr('class');
                        currentItemIndex = parseInt(cssClass.split('tagorder-')[1]);
                        checkContinous();
                    }

                    if (options.counter) {
                        if ($.trim(cssClass) != '') {
                            $(obj).next().html(currentItemIndex + ' of ' + totalItems);
                        }
                    }
                };

                function checkContinous() {
                    if (!options.continuous && (currentItemIndex == itemsInSlider || currentItemIndex == 1)) {
                        clearTimeout(timeout);
                        disableAutoForce = true;
                        if (options.showControls) {
                            if (currentItemIndex == itemsInSlider) {
                                $(nextButtonSelector, obj).addClass('disabled');
                                $(previousButtonSelector, obj).removeClass('disabled');
                            }

                            if (currentItemIndex == 1) {
                                $(previousButtonSelector, obj).addClass('disabled');
                                $(nextButtonSelector, obj).removeClass('disabled');
                            }
                        }
                    } else {
                        if (options.showControls) {
                            $(nextButtonSelector, obj).removeClass('disabled');
                            $(previousButtonSelector, obj).removeClass('disabled');
                        }
                    }
                }
                
                if (options.auto) {				
					timeout = setTimeout(function () {
						animate('next', false);
					}, options.pause);					
                };
            }
        });
    };
})(jQuery);