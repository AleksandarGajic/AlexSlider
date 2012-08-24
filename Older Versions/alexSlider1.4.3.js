/******************************************************
* 
* Project name: Vega IT Sourcing Alex Slider - Version 1.4.3
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
            prevBtnClass: 'prevBtn',    // Css class for previous button
            prevBtnText: 'Previous',    // Text for previous button
            nextBtnClass: 'nextBtn',    // Css class for next button
            nextBtnText: 'Next',        // Text for next button
            playBtnText: 'Play',        // Text for play button
            pauseBtnText: 'Pause',      // Text for pause button
            playBtnClass: 'playBtn',    // Css class for play button
            pauseBtnClass: 'pauseBtn',  // Css class for pause button
            showControls: true,         // Show next previous buttons
            speed: 600,                 // Speed for completing animation
            auto: true,                 // Auto rotate items in slider
            pause: 3000,                // Pause between two animations
            width: -1,                  // Set width for li tags in slider
            continues: true,           // After sliding all items, return to first, otherwise will stop at last element
            overedge: false,            // Animation effect to go over edge current item
            overedgePercentage: 12,     // Percentage of with/height to do overedge
            overedgeSpeed: 300,         // Speed of overedge animation
            autoresize: false,          // Auto risize slider elements
            orientationVertical: false, // If set to true it gonna slide verticaly otherwise it's gonna be horizontal slide animation
            verticalWrapper: 'veritcal-wrapper',    // Css class for vertical wrapper
            navigationWrapperClass: 'navigation-controls',  // Css class for navigation ul list
            navigationClass: 'thumbNav',    // Css class for navigation items	
            navigation: false,          // Show/hide navigation
            counter: false,             // Show/hide counter of items (1 of 5)
            fadeEffect: false,          // Animation is fade effect
            itemsToDisplay: 1,          // How many items are displayed
            disableOnClick: false,      // After clicking on next, previous, or some button on navigation auto sliding is turned off
            playPause: false,           // Show/hide play pause buttons
            timeToStartPlay: 0,         // Time after clicking play to start animation
            galleryClass: 'preview-gallery',    // Css class for gallery with tumbnail images
            galleryImageThumb: '',      // For thumbnail images in galery will be used first img tag in slider li tags. If you have thumbnail images with same image name but with some suffix then you can say what suffix is. Like in umbraco, all images have theirs thumbnails with _thumb suffix
            showGallery: false,         // Show/hide thumbnail images for navigation, it takes first img tag in li tag-s of slider
            counterText: ' of ',        // Text between counter numbers
			classWrapper: 'inner-wrapper', // Additional wrapper class name
			setWrapper: false, 			// Set additional wrapper	
            complete: function () { },   // For additional scripts to execute after comleting initialization of 
			lastItemCallBack: false, 	// Call function on last item.
			lastItemFunction: function () { }
        };

        options = $.extend(defaults, options);

        this.each(function () {
            var s, currentItemIndex = 1, doOverEdge, leftright,
                animationStarted = false, obj = $(this), initialization = $(obj).hasClass('initialized'),
                totalItems, disableAutoForce = false, nextButtonSelector = 'span.' + options.nextBtnClass + ' a',
                previousButtonSelector = 'span.' + options.prevBtnClass + ' a', playButtonSelector = 'span.' + options.playBtnClass,
                pauseButtonSelector = 'span.' + options.pauseBtnClass,
                navigationSelector = '.' + options.navigationWrapperClass + ' ul.' + options.navigationClass + ' li a',
                currentNavigationSelector = '.' + options.navigationWrapperClass + ' ul.' + options.navigationClass + ' li a.cur',
                gallerySelector = '.' + options.galleryClass + ' ul li a',
                currentGallerySelector = '.' + options.galleryClass + ' ul li a.cur',
                slectroForGalleryAndNavigation = '', itemsInSlider, timeout, h, i, w, t, ot, p, hp, animationMarginTop,
                counter, heightBody, newHeight, html, cssClass = '', imageUrl, length, extension, counterT,
                litag, correction, currentWidth, marginLeft, animationMarginLeft, selector, wplus, index,
                tagPosition, previous, differ, nextDirection, difference, selectedIndex, selectedItem, previousItem,
                verticalWrapperSelector = '.' + options.verticalWrapper, marginTop, $liTag, cssCalss, supreme, finalSuppreme, previousCurrentItem;

            if (options.navigation) {
                slectroForGalleryAndNavigation = navigationSelector;
            }

            if (options.showGallery) {
                if (slectroForGalleryAndNavigation !== '') {
                    slectroForGalleryAndNavigation += ', ';
                }

                slectroForGalleryAndNavigation += gallerySelector;
            }

            if (options.playPause) {
                options.auto = false;
            }

            function checkContinues() {				
                if (!options.continues && (currentItemIndex == totalItems || currentItemIndex == 1)) {					
                    clearTimeout(timeout);
                    disableAutoForce = true;
                    if (options.showControls) {
                        if (currentItemIndex == totalItems) {
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

            function setTags(isNext, idx) {
                tagPosition = isNext ? 'first' : 'last';
                $('ul:first > li:' + tagPosition, obj).wrap("<ul class='wrapping'>");
                litag = $('ul.wrapping', obj).html();
                $('ul.wrapping', obj).remove();
                if (isNext) {
                    $('ul:first', obj).append(litag);
                } else {
                    $('ul:first > li:first', obj).before(litag);
                }

                if (idx !== 9999) {
                    cssClass = $('ul:first > li', obj).eq(t - 1).attr('class');
                    currentItemIndex = parseInt(cssClass.split('tagorder-')[1], 10);
                    checkContinues();
                }
				
                if (options.counter) {
                    if ($.trim(cssClass) !== '') {
                        $(obj).next().html(currentItemIndex + options.counterText + totalItems);
                    }
                }
				
				if (options.lastItemCallBack && currentItemIndex == 1 && previousCurrentItem === totalItems) {					
					setTimeout(options.lastItemFunction);
				}
				
				previousCurrentItem = currentItemIndex;
            }

            function setHeightOfActiveTag(pos, stopAnimation) {
                if (options.autoresize) {
                    if (stopAnimation) {
                        $(obj).height($('ul:first > li', obj).eq(pos).height());
                    }

                    newHeight = $('ul:first > li', obj).eq(pos).height();
                    $(obj).animate(
						{ height: newHeight + 10 },
						options.speed * 3 / 4);
                }
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
                        }

                        if (options.navigation) {
                            selector = $('ul:first > li', obj).eq(t - 1).attr('class');
                            $(navigationSelector, obj).each(function () {
                                if ($(this).hasClass(selector)) {
                                    $(this).addClass('cur');
                                } else {
                                    $(this).removeClass('cur');
                                }
                            });
                        }

                        if (options.showGallery) {
                            selector = $('ul:first > li', obj).eq(t - 1).attr('class');
                            $(gallerySelector, obj).each(function () {
                                if ($(this).hasClass(selector)) {
                                    $(this).addClass('cur');
                                } else {
                                    $(this).removeClass('cur');
                                }
                            });
                        }

                        if (options.fadeEffect) {
                            $('ul:first > li', obj).eq(ot - 1).fadeOut(options.speed);
                            $('ul:first > li', obj).eq(t - 1).fadeIn(options.speed, function () {
                                animationStarted = false;
                            });
                        } else {
                            correction = false;
                            currentWidth = $('ul:first', obj).width();
                            animationMarginLeft = p + (doOverEdge * leftright * p * (options.overedgePercentage / 100));
                            animationMarginTop = hp + (doOverEdge * leftright * hp * (options.overedgePercentage / 100));
                            marginLeft = (1 - ot) * w;
                            marginTop = (1 - ot) * h;
                            if (options.itemsToDisplay > 2) {
                                marginLeft = animationMarginLeft;
                                if (leftright < 0) {
                                    marginLeft = animationMarginLeft - w * 2;
                                }

                                animationMarginLeft -= w;
                                correction = true;
                                index = t;// - options.itemsToDisplay;
                                index = index < 0 ? 0 : index;
                                html = $('ul:first > li', obj).eq(index).html();
                                html = '<li style="float:left">' + html + '</li>';
                                $('ul:first', obj).width(currentWidth + 2 * w)
													.prepend(html)
													.append(html);
                            }

                            if (options.orientationVertical) {
                                $('ul:first', obj).css('margin-top', marginTop + 'px');
                                $('ul:first', obj).animate({ 'margin-top': animationMarginTop }, options.speed,
                                                            function () {
                                                                if (options.overedge) {
                                                                    $('ul:first', obj).animate({ 'margin-top': hp }, options.overedgeSpeed, function () { animationStarted = false; });
                                                                } else { animationStarted = false; }
                                                            });
                            }
                            else {
                                $('ul:first', obj).css('margin-left', marginLeft + 'px');
                                $('ul:first', obj).animate({ 'margin-left': animationMarginLeft },
														options.speed, function () {
                                                            if (options.overedge) {
                                                                $('ul:first', obj).animate({ 'margin-left': p }, options.speed / 3, function () { animationStarted = false; });
                                                            } else {
                                                                animationStarted = false;
                                                                if (correction) {
                                                                    $('ul:first > li:first', obj).remove();
                                                                    $('ul:first > li:last', obj).remove();
                                                                    $('ul:first', obj).width(currentWidth);
                                                                    $('ul:first', obj).css('margin-left', animationMarginLeft + w);
                                                                }
                                                            }
														});
                            }
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
                    counter += 1;
                });

                h = $('ul:first > li:first', obj).height();

                itemsInSlider = s = $('ul:first > li', obj).length;
                w = $('ul:first > li:first', obj).width();

                if ($('ul:first > li img', obj).length) {
                    $('ul:first > li img', obj).each(function () {
                        $('ul:first > li img', obj).eq(0).load(function () {
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

                if (options.width !== -1) {
                    w = options.width;                                       
                }

                if (options.showGallery) {
                    html = '<div class="' + options.galleryClass + '">';
                    html += '<ul>';

                    imageUrl = '';
                    for (i = 0; i < s; i += 1) {
                        if (i === 0) {
                            cssClass = (i + 1) + ' cur';
                        } else {
                            cssClass = (i + 1) + '';
                        }

                        $liTag = $('ul:first > li', obj).eq(i);
                        imageUrl = $liTag.children('img:first').attr('src');
                        if (options.galleryImageThumb !== '') {
                            index = imageUrl.lastIndexOf('.');
                            length = imageUrl.length;
                            extension = imageUrl.substr(index + 1, length);
                            imageUrl = imageUrl.substr(0, index) + options.galleryImageThumb + '.' + extension;
                        }

                        html += '<li><a href="javascript:;" class="tagorder-' + cssClass + '"><img src="' + imageUrl + '" alt="image"/></a></li>';
                    }
                    html += '</ul>';
                    html += '</div>';
                    $(obj).append(html);
                }

                if (options.showControls && s != 1) {
                    html = ' <span class="' + options.prevBtnClass + '"><a href=\"javascript:void(0);\"';

                    if (!options.continues) {
                        html += 'class="disabled"';
                    }
                    html += ' >' + options.prevBtnText + '</a></span>';
                    html += ' <span class="' + options.nextBtnClass + '"><a href=\"javascript:void(0);\">' + options.nextBtnText + '</a></span>';
                    $(obj).append(html);
                }

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
                    for (i = 0; i < s; i += 1) {
                        if (i === 0) {
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

                if (options.autoresize) {
                    obj.height(h);
                } else {
                    $('ul:first', obj).height(h);
                    $('ul:first > li', obj).height(h);
                }

                obj.css("overflow", "hidden");
                t = Math.ceil(s / 2);
                counterT = t;
                if (s > 2) {
                    counterT += 1 - s % 2;

                    for (i = 0; i < counterT; i += 1) {
                        $('ul:first > li:first', obj).wrap('<ul class="wrapping">');
                        litag = $('ul.wrapping', obj).html();
                        $('ul.wrapping', obj).remove();
                        $('ul:first', obj).append(litag);
                    }

                    if (!options.fadeEffect) {
                        if (options.orientationVertical) {
                            $('ul:first', obj).css('margin-top', (1 - t) * h + 'px');
                        } else {
                            $('ul:first', obj).css('margin-left', (1 - t) * w + 'px');
                        }
                    }
                }

                if (s == 2 || (s <= (options.itemsToDisplay + 3) && options.itemsToDisplay > 1)) {
                    s *= 2;
                    t = counterT = options.fadeEffect ? 2 : 3;
					if (options.itemsToDisplay > 1) {
						t = Math.ceil(s / 2);
						if (!options.fadeEffect) {
							if (options.orientationVertical) {
								$('ul:first', obj).css('margin-top', (1 - t) * h + 'px');
							} else {
								$('ul:first', obj).css('margin-left', (1 - t) * w + 'px');
							}
						}
						 
						supreme = t - options.itemsToDisplay;
						if (supreme <= 0) {
							finalSuppreme = 2;
						} else {
							finalSuppreme = Math.floor(supreme / 2) + 2;
							finalSuppreme = supreme % 2 === 0 ? finalSuppreme + 1 : finalSuppreme;
						}
												
						for (i = 0; i < finalSuppreme; i++){
							setTags(false, 9999);
						}
					}
										
                    litag = $('ul:first', obj).html();
                    $('ul:first', obj).append(litag);
                }

                p = (1 - t) * w;
                hp = (1 - t) * h;

                if (options.fadeEffect) {
                    $('ul:first', obj).css('width', w)
                                    .find('> li')
                                    .css('position', 'absolute')
                                    .hide()
                                    .eq(t - 1)
                                    .show();
                } else {
                    if (options.orientationVertical) {
                        $('ul:first', obj).css('height', s * h)
                                            .wrap('<div class="' + options.verticalWrapper + '"/>');
                        $(verticalWrapperSelector, obj).css('height', h + 'px')
                                                        .css('overflow', 'hidden');
                    } else {
                        $('ul:first', obj).css('width', s * w)
                                            .find('> li')
                                            .css('float', 'left');
						
						if (options.setWrapper) {
							$('ul:first', obj).wrap('<div class="' + options.classWrapper + '"/>');
						}
                    }
                }

                $(slectroForGalleryAndNavigation, obj).click(function () {
                    if (!$(this).hasClass('cur')) {
                        if (options.playPause) {
                            $(pauseButtonSelector, obj).hide();
                            $(playButtonSelector, obj).show();
                        }

                        if (!animationStarted) {
                            currentItemIndex = parseInt($(this).attr('class').split('tagorder-')[1], 10);
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

                                checkContinues();

                                $(this).addClass('cur');
                                selectedIndex = $('ul:first > li.' + selectedItem, obj).index();
                                difference = selectedIndex - (t - 1);

                                nextDirection = difference > 0 ? true : false;

                                differ = difference;
                                difference = Math.abs(difference);

                                for (i = 0; i < difference; i += 1) {
                                    setTags(nextDirection, 9999);
                                }

                                if (options.autoresize) {
                                    setHeightOfActiveTag(t - 1);
                                }

                                commenceAnimation('none', false, true);

                                if (options.fadeEffect) {
                                    $('ul:first > li.' + previousItem, obj).fadeOut(options.speed)
                                                                            .eq(t - 1)
                                                                            .fadeIn(options.speed, function () { animationStarted = false; });
                                } else {
                                    correction = false;
                                    currentWidth = $('ul:first', obj).width();
                                    marginLeft = p + differ * w;
                                    animationMarginLeft = p;
                                    if (differ == t || options.itemsToDisplay > 1) {
                                        marginLeft = 0;
                                        animationMarginLeft -= w;
                                        correction = true;
                                        html = $('ul:first > li.' + previousItem, obj).html();
                                        html = '<li style="float:left">' + html + '</li>';
                                        $('ul:first', obj).width(currentWidth + 2 * w)
                                                            .prepend(html);
                                    }

                                    $('ul:first', obj).css('margin-left', marginLeft);
                                    $('ul:first', obj).animate({ 'margin-left': animationMarginLeft },
                                                                options.speed,
                                                                function () {
                                                                    animationStarted = false;
                                                                    if (correction) {
                                                                        $('ul:first > li:first', obj).remove();
                                                                        $('ul:first', obj).width(currentWidth)
                                                                                            .css('margin-left', animationMarginLeft + w);
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

                if (options.auto) {
                    timeout = setTimeout(function () {
                        commenceAnimation('forward', false);
                    }, options.pause);
                }

                setTimeout(options.complete);
            }
        });
    };
})(jQuery);