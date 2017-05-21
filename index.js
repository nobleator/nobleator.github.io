//JavaScript for scroll animation
function scroll(element, to, duration) {
	if (duration <= 0) {
		return;
	}
	var diff = to - element.scrollTop;
	var perTick = diff / duration * 10;

	setTimeout(function() {
		element.scrollTop += perTick;
		if (element.scrollTop === to) {
			return;
		} else {
			scroll(element, to, duration - 10);
		}
	}, 10);
}

function scrollToLocation(tag) {
	elem = document.getElementById(tag);
	// Offset by 110 to account for navbar height
	scroll(document.body || document.documentElement, elem.offsetTop - 110, 800);
}

// Change 'active' style tag depending on which section is visible
function changeActiveIcon(pos) {
	var navHeight = 110;
	var homeElem = document.getElementById('home');
	var homeElemTop = homeElem.getBoundingClientRect().top;
	var homeElemBottom = homeElem.getBoundingClientRect().bottom;
	var aboutMeElem = document.getElementById('about-me');
	var aboutMeElemTop = aboutMeElem.getBoundingClientRect().top;
	var aboutMeElemBottom = aboutMeElem.getBoundingClientRect().bottom;
	var projectsElem = document.getElementById('projects');
	var projectsElemTop = projectsElem.getBoundingClientRect().top;
	var projectsElemBottom = projectsElem.getBoundingClientRect().bottom;
	var dataCrunchingElem = document.getElementById('data-crunching');
	var dataCrunchingElemTop = dataCrunchingElem.getBoundingClientRect().top;
	var dataCrunchingElemBottom = dataCrunchingElem.getBoundingClientRect().bottom;
	if (homeElemTop < navHeight && homeElemBottom > 0) {
		applyActiveTag('home');
	} else if (aboutMeElemTop < navHeight && aboutMeElemBottom > 0) {
		applyActiveTag('about-me');
	} else if (projectsElemTop < navHeight && projectsElemBottom > 0) {
		applyActiveTag('projects');
	} else if (dataCrunchingElemTop < navHeight && dataCrunchingElemBottom > 0) {
		applyActiveTag('data-crunching');
	}
}
function applyActiveTag(elemTag) {
	var icons = document.getElementsByClassName('icon');
	for (var i = 0; i < icons.length; i++) {
		icons[i].classList.remove('active');
	}
	document.getElementsByClassName(elemTag + ' icon')[0].classList.add('active');
}
// Monitor for scrolls to check and change active tags
var last_known_scroll_position = 0;
var ticking = false;
window.addEventListener('scroll', function(e) {
	last_known_scroll_position = window.scrollY;
	if (!ticking) {
	  window.requestAnimationFrame(function() {
	    changeActiveIcon(last_known_scroll_position);
	    ticking = false;
	  });
	}
	ticking = true;
});
