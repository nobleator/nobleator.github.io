// TODO: Convert JQuery to vanilla JS
//JavaScript/JQuery for scroll animation
$(document).on('click', '#nav-links a', function(event){
	event.preventDefault();
	$('html, body').animate({
			scrollTop: $( $.attr(this, 'href') ).offset().top - 110
	}, 800);
});

// Javascript for hightlighting active page section icon in navbar
$(document).ready(function() {
	//Find locations of sections and assign to an array of positions
	var homeOffset = $('#home').offset().top - 100,
			aboutMeOffset = $('#about-me').offset().top - 100,
			projectsOffset = $('#projects').offset().top - 100,
			dataOffset = $('#data-crunching').offset().top - 100;
	$(window).scroll(function() {
		//Find top of viewport
		var topEdge = $(document).scrollTop();
		//Find section closest to topEdge and apply style
		if (topEdge < homeOffset) {
			$('.icon').removeClass('active');
			$('.home').addClass('active');
		} else if (topEdge > homeOffset && topEdge < aboutMeOffset) {
			$('.icon').removeClass('active');
			$('.about-me').addClass('active');
		} else if (topEdge > aboutMeOffset && topEdge < projectsOffset) {
			$('.icon').removeClass('active');
			$('.projects').addClass('active');
		} else {
			$('.icon').removeClass('active');
			$('.data-crunching').addClass('active');
		}
	});
});
