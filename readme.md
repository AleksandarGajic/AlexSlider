#AlexSlider

AlexSlider is jquery plugin which requires jquery version 1.4.2 or above.

Because of the fairness of open-source software and especially the MIT license, you can use the slider free of charge. Modify it, copy it, share it. That's the brilliance at work.

You can find [demo on this link](http://www.vegaitsourcing.rs/articles/2012/01/alex-slider-a-jquery-slider/ "AlexSlider demo").

AlexSlider is responsive slider.

##Code
<code>$('.slider').Slider();</code>

######HTML for slider:
<code>
<div class="slider">
      	<ul>
		<li>
			<img src="image1.png" alt="image1" />
		</li>
		<li>
			<img src="image2.png" alt="image2" />
		</li>
	</ul>
 </div> 
</code>

######CSS for slider:
<code> 
#demo {
	width: 350px;
	float: left;
	clear: left;
}
#demo img {
	width: 350px;
	height: 200px;
}
</code> 

######In order to activate slider to be responsive its only needed to set property reponsive to true
<code>
$('.slider').Slider({
		responsive: true
	});
</code>
###Default properties for slider
            prevBtnClass: 'prevBtn',    // Css class for previous button
            prevBtnText: 'Previous',    // Text for previous button
            nextBtnClass: 'nextBtn',    // Css class for next button
            nextBtnText: 'Next',        // Text for next button
            playBtnText: 'Play',        // Text for play button
            pauseBtnText: 'Pause',      // Text for pause button
            playBtnClass: 'playBtn',    // Css class for play button
            pauseBtnClass: 'pauseBtn',  // Css class for pause button
            showControls: true,         // Show next previous buttons
			wrapControls: false,		// It will wrap controls with ul list
			wrapControlsClass: 'slider-navigation',	// It will wrap controls with ul list
            speed: 600,                 // Speed for completing animation
            auto: true,                 // Auto rotate items in slider
            pause: 3000,                // Pause between two animations
            width: -1,                  // Set width for li tags in slider
            continues: true,			// After sliding all items, return to first, otherwise will stop at last element
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
			changedItem: null,	// For additional scripts to execute after item is changed. Example: function ($item) { alert($item.attr('class')); }; //$item is new displayed element
			itemClicked: null,	// For additional scripts to execute on item is clicked. Example: function (e, $item) { alert($item.attr('class')); },
			dragging: false,
			changeOrientation: false, // For changing orienation of slides movement,
			responsive: false // For enabling responsive behaviour
