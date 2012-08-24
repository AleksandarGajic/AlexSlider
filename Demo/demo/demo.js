$(window).load(function () {
	$('.demo1').Slider({		
		speed: 800,
		pause: 2000,
		itemClicked: function(e, $item) {
			alert($item.find('input[type=hidden]').val());
		}
    });

    $('.demo2').Slider({
        speed: 800,
        pause: 2000,		
        overedge: true
    });
	
	$('.demo3').Slider({		
		speed: 500,
		pause: 1200,
		playPause: true,
		timeToStartPlay: 400
	});

    $('.demo4').Slider({
        speed: 500,
        pause: 1500,
		changedItem: function($item) {
			var text = $item.find('input[type=hidden]').val();			
			$item.parent().prev().html(text);
		},
        navigation: true,		
        showControls: false
    }); 
	
	$('.demo5').Slider({		
		speed: 800,
		pause: 2000,
		fadeEffect: true
	}); 
	
	$('.demo6').Slider({		
		speed: 1000,
		pause: 3000,		
		auto: true,	
		fadeEffect: true,
		showGallery: true,
		complete: function() {
			$('.preview-gallery ul li a').hover(
				function() {
					$(this).children().css('top','0px');
				}, function () {
					$(this).children().css('top','25px');
				});
		}	
	});   
	
	$('.demo7').Slider({		
		speed: 1500,
		pause: 2000,
		itemsToDisplay: 2
	}); 
	
	$('.demo8').Slider({		
		speed: 800,
		pause: 4000,		
		itemsToDisplay: 3
	});

	$('.demo9').Slider({		
		speed: 800,
		pause: 3000,
		navigation: true,
		disableOnClick: true,
		itemsToDisplay: 3
	});
    $('.demo10').Slider({
        auto: false,
        speed: 600,
        pause: 4000,
        orientationVertical: true,
        overedge: true
    });

    $('.demo11').Slider({
        auto: false,
        speed: 900,
        pause: 4300,
        orientationVertical: true
    });

    $('.demo12').Slider({
        speed: 1200,
        pause: 3200,
        auto: false,
        continues: false
    });	
	
	$('.demo13').Slider({		
		speed: 800,
		pause: 2000,		
		auto: true,		
		showGallery: true,		
		orientationVertical: true,
		complete: function() {
			$('.preview-gallery ul li a').hover(function() {
				$(this).children().css('top','0px');}
				,function () {
				$(this).children().css('top','25px');});
			}				
	}); 
	
	$('.demo14').Slider({
        speed: 700,
        pause: 3000,
        counter: true
    });
	
	$('.demo15').Slider({		
		orientationVertical: true,
		speed: 800,
		pause: 4000,
		itemsToDisplay: 5
	});
	
	$('.demo16').Slider({
        auto: false,
        speed: 600,
        pause: 4000,
        orientationVertical: true,
		navigation: true,
		showControls: true    
    });	
	
    $('.demo17').Slider({
        speed: 1000,
        pause: 2500,
        autoresize: true
    });   
});	