// TODO: Convert JQuery to vanilla JS
//JavaScript/JQuery for scroll animation
function scrollToLocation(location, scrollDuration) {
		console.log(location);
		console.log(document.body.scrollTop || document.documentElement.scrollTop);
		console.log(document.getElementById(location).offsetTop);
		console.log(document.getElementById('home').offsetTop);
		console.log(document.getElementById('about-me').offsetTop);
		console.log(document.getElementById('projects').offsetTop);
		console.log(document.getElementById('data-crunching').offsetTop);

		var current = document.body.scrollTop;
		var target = document.getElementById(location).offsetTop;
		var diff = target - current;
		console.log(diff);
    //var scrollStep = -window.scrollY / (scrollDuration / 15),
		var scrollStep = location / (scrollDuration / 15),
      scrollInterval = setInterval(function(){
      if ( diff < 0 ) {
        window.scrollBy( 0, scrollStep );
      } else if ( diff > 0 ) {
				window.scrollBy( 0, -scrollStep );
			}
      else {
				clearInterval(scrollInterval);
			}
    },15);
}

/*
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
*/
