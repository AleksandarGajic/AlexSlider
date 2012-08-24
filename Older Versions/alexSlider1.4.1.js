/******************************************************
 * 
 * Project name: Vega IT Sourcing Alex Slider - Version 1.4.1
 * Author: Vega IT Sourcing Alex Slider by Aleksandar Gajic
 * 
******************************************************/
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

(function ($) {
	$.fn.Slider = function (options) {
        var defaults = {
            prevBtnClass: 'prevBtn',		// Css class for previous button
            prevBtnText: 'Previous',		// Text for previous button
            nextBtnClass: 'nextBtn',		// Css class for next button
            nextBtnText: 'Next',			// Text for next button
			playBtnText: 'Play',			// Text for play button
			pauseBtnText: 'Pause',			// Text for pause button
			playBtnClass: 'playBtn',		// Css class for play button
			pauseBtnClass: 'pauseBtn',		// Css class for pause button
            showControls: true,				// Show next previous buttons
            speed: 600,						// Speed for completing animation
            auto: true,						// Auto rotate items in slider
            pause: 3000,					// Pause between two animations
            width: -1,						// Set width for li tags in slider
            continuous: true,				// After sliding all items, return to first, otherwise will stop at last element
            overedge: false,				// Animation effect to go over edge current item
            autoresize: false,				// Auto risize slider elements
			navigationWrapperClass : 'navigation-controls', // Css class for navigation ul list
			navigationClass : 'thumbNav',	// Css class for navigation items	
            navigation: false,				// Show/hide navigation
            counter: false,					// Show/hide counter of items (1 of 5)
            fadeEffect: false,				// Animation is fade effect
			itemsToDisplay: 1,				// How many items are displayed
            disableOnClick: false,			// After clicking on next, previous, or some button on navigation auto sliding is turned off
			playPause: false,				// Show/hide play pause buttons
			timeToStartPlay : 0,			// Time after clicking play to start animation
			galleryClass : 'preview-gallery',	// Css class for gallery with tumbnail images
			galleryImageThumb : '',				// For thumbnail images in galery will be used first img tag in slider li tags. If you have thumbnail images with same image name but with some suffix then you can say what suffix is. Like in umbraco, all images have theirs thumbnails with _thumb suffix
			showGallery : false,			// Show/hide thumbnail images for navigation, it takes first img tag in li tag-s of slider
			counterText : ' of ',			// Text between counter numbers
			complete: function() {}			// For additional scripts to execute after comleting initialization of 
        };

        options = $.extend(defaults, options);

        this.each(function () {			
            var s, currentItemIndex = 1, doOverEdge, indexOfActiveTag = 1, leftright,
            	animationStarted = false, obj = $(this), initialization = $(obj).hasClass('initialized'),
            	totalItems, disableAutoForce = false, nextButtonSelector = 'span.' + options.nextBtnClass + ' a',
            	previousButtonSelector = 'span.' + options.prevBtnClass + ' a', playButtonSelector = 'span.' + options.playBtnClass,
            	pauseButtonSelector = 'span.' + options.pauseBtnClass, 
            	navigationSelector = '.' + options.navigationWrapperClass + ' ul.'+ options.navigationClass +' li a',
            	currentNavigationSelector = '.' + options.navigationWrapperClass + ' ul.'+ options.navigationClass +' li a.cur',
            	gallerySelector = '.' + options.galleryClass + ' ul li a',
            	currentGallerySelector = '.' + options.galleryClass + ' ul li a.cur',
            	slectroForGalleryAndNavigation = '', itemsInSlider, timeout, h, i, w, t, ot, p, 
            	counter, heightBody, newHeight, html, cssClass, imageUrl, index, length, extension, counterT,
            	litag, correction, currentWidth, marginLeft, animationMarginLeft, selector, wplus, index,
            	tagPosition, previous, differ, nextDirection, difference, selectedIndex, selectedItem, previousItem;
					
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
					
                    newHeight = $($('ul:first > li', obj)[pos]).height();
                    $(obj).animate(
						{ height: newHeight + 10 },
						options.speed * 3 / 4);
                }
            }
			
			if (options.autoresize) {
				heightBody = $('ul:first > li:first', obj).height();
				$(obj).css('height', heightBody + 'px');
			}
			
            if (options.overedge) {
                doOverEdge = 1;
            } else {
                doOverEdge = 0;
            }

            if (!initialization) {
                $(obj).addClass('initialized');

                counter = 1;
                $('ul:first > li', obj).each(function () {
                    $(this).addClass('tagorder-' + counter);
                    counter++;
                });

                itemsInSlider = s = $('ul:first > li', obj).length;
                w = $('ul:first > li', obj).width();

                if ($('ul:first > li img', obj).length) {
                    $('ul:first > li img', obj).each(function () {
                        $($('ul:first > li img', obj)[0]).load(function () {
                            h = $('ul:first > li', obj).height();
                            if ($(obj).height < h) {
                                $(obj).height(h);
                            }
                        });
                    });
                } else {
                    h = $('ul:first li', obj).height();
                    $(obj).height(h);
                }

                h += 10;
                if (options.width !== -1) {
                    w = options.width;
                    $('ul:first > li', obj).width(w);
                    $('ul:first > li > img', obj).width(w);
                }
				
				if (options.showGallery) {
					html = '<div class="' + options.galleryClass + '">';
					html += '<ul>';				
					
					imageUrl = '';
					for (i = 0; i < s; i++) {
						cssClass;
						if (i == 0) {
							cssClass = (i + 1) + ' cur';
						} else {
							cssClass = (i + 1) + '';
						}
						
						$liTag = $($('ul:first > li', obj)[i]);
						imageUrl = $liTag.children('img:first').attr('src');
						if (options.galleryImageThumb != '') {
							index = imageUrl.lastIndexOf('.');
							length = imageUrl.length;
							extension = imageUrl.substr(index + 1, length);
							imageUrl = imageUrl.substr(0, index) + options.galleryImageThumb + '.' + extension;
						}
						
						html += '<li><a href="javascript:;" class="tagorder-' + cssClass + '"><img src="' + imageUrl +'" alt="image"/></a></li>';
					}							
					html +=	'</ul>';
					html += '</div>';
					$(obj).append(html);
				}			

                if (options.showControls && s != 1) {
                    html = ' <span class="' + options.prevBtnClass + '"><a href=\"javascript:void(0);\"';

                    if (!options.continuous) {
                        html += 'class="disabled"';
                    }
                    html += ' >' + options.prevBtnText + '</a></span>';
                    html += ' <span class="' + options.nextBtnClass + '"><a href=\"javascript:void(0);\">' + options.nextBtnText + '</a></span>';
                    $(obj).append(html);
                };
				
				if (options.playPause && s != 1) {
					html = ' <span class="' + options.playBtnClass + '"><a href=\"javascript:void(0);\"';                    
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
                	cssCalss = '';
                    html = '<div class="' + options.navigationWrapperClass + '">';
                    html += '<ul class="' + options.navigationClass + '">';
                    for (i = 0; i < s; i++) {
                        if (i == 0) {
                        	cssCalss = (i + 1) + ' cur';
                        } else {
                        	cssCalss = (i + 1) + '';
                        }

                        html += '<li><a href="javascript:;" class="tagorder-' + cssCalss + '"><span>' + (i + 1) + '</span></a></li>';
                    }

                    html += '</ul>';
                    html += '</div>';
                    $(obj).append(html);
                }

                h += 100;
                obj.height(h);
                obj.css("overflow", "hidden");
                t = Math.ceil(s / 2);
                $('ul:first', obj).height(h);
                $('ul:first > li', obj).height(h);
                counterT = t;
                if (s > 2) {
                    if (s % 2 == 0) {
                        counterT++;
                    }

                    for (i = 0; i < counterT; i++) {
                        $('ul:first > li:first', obj).wrap('<ul class="wrapping">');
                        litag = $('ul.wrapping', obj).html();
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

                    litag = $('ul:first', obj).html();
                    $('ul:first', obj).append(litag);
                }
                
                p = ((t - 1) * w * -1);

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
								
								if ($(currentNavigationSelector, obj).length) {
									previous = $(currentNavigationSelector, obj);
								} else {
									previous = $(currentGallerySelector, obj);
								}
								
								$(navigationSelector, obj).removeClass('cur');
								$(gallerySelector, obj).removeClass('cur');
															
								previousItem = $(previous).attr('class');
								selectedItem = $(this).attr('class');
																	
								checkContinous();
	
								$(this).addClass('cur');
								selectedIndex = $('ul:first > li.' + selectedItem, obj).index();
								difference = selectedIndex - (t - 1);							
								
								nextDirection = difference > 0 ? true : false;								
										
								differ = difference;
								difference = Math.abs(difference);
	
								for (i = 0; i < difference; i++) {
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
									correction = false;
									currentWidth = $('ul:first', obj).width();
									marginLeft = p + differ * w;
									animationMarginLeft = p + (doOverEdge * nextDirection * p / 8);
									if (differ == t || options.itemsToDisplay > 1) {
										marginLeft = 0;
										animationMarginLeft -=  w;
										correction = true;
										html = $('ul:first > li.' + previousItem, obj).html();
										html = '<li style="float:left">' + html + '</li>';
										$('ul:first', obj).width(currentWidth + 2 * w);
										$('ul:first', obj).prepend(html);										
									}
																		
									$('ul:first', obj).css('margin-left', marginLeft);
									$('ul:first', obj).animate({'margin-left': animationMarginLeft }, 
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
                                    ot = t + 1;
                                    setTags(false, t - 1);
                                    setHeightOfActiveTag(t - 1);
                                    break;
                                default:									
                                    break;
                            };
							
							if (options.navigation) {
								selector = $($('ul:first > li', obj)[t - 1]).attr('class');
								$(navigationSelector, obj).each(function () {
									if ($(this).hasClass(selector)) {
										$(this).addClass('cur');
									} else {
										$(this).removeClass('cur');
									}
								});
							}
							
							if (options.showGallery) {							
								selector = $($('ul:first > li', obj)[t - 1]).attr('class');
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
								correction = false;
								currentWidth = $('ul:first', obj).width();									
								animationMarginLeft = p + (doOverEdge * leftright * p / 8);
								marginLeft = (ot - 1) * w * -1;
								if (options.itemsToDisplay > 2) {
									marginLeft = animationMarginLeft;
									wplus = 0;
									if (leftright < 0) {
										marginLeft -= w * (options.itemsToDisplay - 1);
									}
									
									animationMarginLeft -= w;
									correction = true;
									index = t - options.itemsToDisplay;
									index = index < 0 ? 0 : index;
									html = $($('ul:first > li', obj)[index]).html();
									html = '<li style="float:left">' + html + '</li>';
									$('ul:first', obj).width(currentWidth + 2 * w);
									$('ul:first', obj).prepend(html);
									$('ul:first', obj).append(html);
								}
																	
								$('ul:first', obj).css('margin-left', marginLeft + 'px');
								$('ul:first', obj).animate({'margin-left': animationMarginLeft }, 
															options.speed, 
															function () {
																if (options.overedge) {
																	$('ul:first', obj).animate(
																		{ 'margin-left': p },
																			options.speed / 3, function () {
																				animationStarted = false;
																			});
																} else { 
																	animationStarted = false; 
																	if (correction) {
																		$('ul:first > li:first', obj).remove();
																		$('ul:first > li:last', obj).remove();
																		$('ul:first', obj).width(currentWidth);
																		$('ul:first', obj).css('margin-left', animationMarginLeft + w + wplus);
																	}
																}
															});								
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
                    tagPosition = isNext ? 'first' : 'last';
                    $('ul:first > li:' + tagPosition, obj).wrap("<ul class='wrapping'>");
                    litag = $('ul.wrapping', obj).html();
                    $('ul.wrapping', obj).remove();
                    if (isNext) {
                        $('ul:first', obj).append(litag);
                    } else {
                        $('ul:first > li:first', obj).before(litag);
                    }

                    if (ot != null) {
                        cssClass = $($('ul:first > li', obj)[ot]).attr('class');
                        currentItemIndex = parseInt(cssClass.split('tagorder-')[1]);
                        checkContinous();
                    }

                    if (options.counter) {
                        if ($.trim(cssClass) != '') {
                            $(obj).next().html(currentItemIndex + options.counterText + totalItems);
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