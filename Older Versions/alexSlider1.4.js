//
// Copyright © 2011 
// Aleksandar Gajic
//
// Alex Slider
//
// Script required
// jquery.js version 1.4.2 or above
//
// Script to initialize slider
// $('.slider').Slider();
//	
//	Minimum HTML for slider.
//	<div class="slider">      
//		<ul>            
//			<li>
//				<img src="image1.png" alt="image1" />
//			</li>
//			<li>
//				<img src="image2.png" alt="image2" />
//			</li>
//		</ul>
//	</div>
//
// Inside li tags you can put what ever you want, not just image tag.
//
// Recommended styles for gallery
//	.preview_gallery { width: 100%;}
//	.preview_gallery ul { list-style: none; position: relative; float: left; display: block; left: 50%; }
//	.preview_gallery ul li { position: relative; float: left; display: block; right: 50%; }
//	.preview_gallery ul li img {width: 50px !important; height: 50px !important;}

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
            pause: 3000,
            width: -1,
            continuous: true,
            overedge: false,
            autoresize: false,
			navigationWrapperClass : 'navigation-controls',
			navigationClass : 'thumbNav',
            navigation: false,
            counter: false,
            fadeEffect: false,
            disableOnClick: true,
			playPause: false,
			timeToStartPlay : 0,
			galleryClass : 'preview_gallery',
			galleryImageThumb : '',
			showGallery : false,
			complete: function() {}
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
			var navigationSelector = '.' + options.navigationWrapperClass + ' ul.'+ options.navigationClass +' li a';
			var currentNavigationSelector = '.' + options.navigationWrapperClass + ' ul.'+ options.navigationClass +' li a.cur';
			var gallerySelector = '.' + options.galleryClass + ' ul li a';
			var currentGallerySelector = '.' + options.galleryClass + ' ul li a.cur';
			var slectroForGalleryAndNavigation = '';
            var itemsInSlider;
			var timeout;
					
			if (options.navigation) {
				slectroForGalleryAndNavigation = navigationSelector;
			}
			
			if (options.showGallery) {
				if (slectroForGalleryAndNavigation != '') {
					slectroForGalleryAndNavigation += ', ';					
				}
				
				slectroForGalleryAndNavigation += gallerySelector;
			}
			
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
				
				if (options.showGallery) {
					var html = '<div class="' + options.galleryClass + '">';
					html += '<ul>';				
					
					var imageUrl = '';
					for (var i = 0; i < s; i++) {
						var cssClass;
						if (i == 0) {
							cssClass = (i + 1) + ' cur';
						} else {
							cssClass = (i + 1) + '';
						}
						
						$liTag = $($('ul:first > li', obj)[i]);
						imageUrl = $liTag.children('img:first').attr('src') + options.galleryImageThumb;
						html += '<li><a href="javascript:;" class="tagorder-' + cssClass + '"><img src="' + imageUrl +'" alt="image1"/></a></li>';
					}							
					html +=	'</ul>';
					html += '</div>';
					$(obj).append(html);
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
							commenceAnimation('forward', false);
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
                            commenceAnimation('forward', true, false);
                        }
						
						if (options.playPause) {
							$(pauseButtonSelector, obj).hide();
							$(playButtonSelector, obj).show();
						}
                    });

                    $(previousButtonSelector, obj).click(function () {
                        if (!$(this).hasClass("disabled")) {
                            commenceAnimation('previous', true, false);
                        }
						
						if (options.playPause) {
							$(pauseButtonSelector, obj).hide();
							$(playButtonSelector, obj).show();
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
                    html = '<div class="' + options.navigationWrapperClass + '">';
                    html += '<ul class="' + options.navigationClass + '">';
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

                $(slectroForGalleryAndNavigation, obj).click(function () {				
                    if (!$(this).hasClass('cur')) {
						if (options.playPause) {
							$(pauseButtonSelector, obj).hide();
							$(playButtonSelector, obj).show();
						}
						
                        if (!animationStarted) {
							currentItemIndex = parseInt($(this).attr('class').split('tagorder-')[1]);
							if (itemsInSlider == 2) {
								if (currentItemIndex == 1) {
									commenceAnimation('previous', true, false);
								} else {
									commenceAnimation('forward', true, false);									
								}
							} else {							
								animationStarted = true;
								var previous;
								
								if ($(currentNavigationSelector, obj).length) {
									previous = $(currentNavigationSelector, obj);
								} else {
									previous = $(currentGallerySelector, obj);
								}
								
								$(navigationSelector, obj).removeClass('cur');
								$(gallerySelector, obj).removeClass('cur');
															
								var previousItem = $(previous).attr('class');
								var selectedItem = $(this).attr('class');
																	
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
	
								commenceAnimation('none', false, true);
	
								if (options.fadeEffect) {
									$('ul:first > li.' + previousItem, obj).fadeOut(options.speed);
									$($('ul:first > li', obj)[t - 1]).fadeIn(options.speed, function () {
										animationStarted = false;
									});
								} else {				
									var correction = false;
									var currentWidth = $('ul:first', obj).width();
									var marginLeft = p + differ * w;
									var animationMarginLeft = p + (doOverEdge * nextDirection * p / 8);
									if (differ == t) {
										marginLeft = 0;
										animationMarginLeft -=  w;
										correction = true;
										var html = $('ul:first > li.' + previousItem, obj).html();
										html = '<li style="float:left">' + html + '</li>';
										$('ul:first', obj).width(currentWidth + w);
										$('ul:first', obj).prepend(html);										
									}
																		
									$('ul:first', obj).css('margin-left', marginLeft);
									$('ul:first', obj).animate({marginLeft: animationMarginLeft }, 
																options.speed, 
																function () { 
																	animationStarted = false; 
																	if (correction) {
																		$('ul:first > li:first', obj).remove();
																		$('ul:first', obj).width(currentWidth);
																		$('ul:first', obj).css('margin-left', animationMarginLeft + w);
																	}
																});																	
								}
							}
                        }
                    }
                });

                if (options.autoresize) {
                    setHeightOfActiveTag(t - 1, true);
                }

                function commenceAnimation(direction, clicked, disableClick) {
                    if (!disableClick) {						
                        if (s != 1 && !animationStarted) {
                            animationStarted = true;
                            switch (direction) {
                                case 'forward':
                                    leftright = 1;
                                    ot = t - 1;
                                    setTags(true, ot);
                                    setHeightOfActiveTag(ot);
                                    break;
                                case 'previous':
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
								$(navigationSelector, obj).each(function () {
									if ($(this).hasClass(selector)) {
										$(this).addClass('cur');
									} else {
										$(this).removeClass('cur');
									}
								});
							}
							
							if (options.showGallery) {							
								var selector = $($('ul:first > li', obj)[t - 1]).attr('class');
								$(gallerySelector, obj).each(function () {
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
                                commenceAnimation('forward', false, false);
                            }, options.speed + options.pause);
                        }
                    }

                    if (options.auto && direction == 'forward' && !clicked) {
                        timeout = setTimeout(function () {
                            commenceAnimation('forward', false, false);
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
						commenceAnimation('forward', false);
					}, options.pause);					
                };
				
				setTimeout(options.complete);
            }
        });
    };
})(jQuery);