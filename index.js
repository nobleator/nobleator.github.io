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

// TODO: Change colors for icons when active
