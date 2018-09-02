let fullscreen;

(function(){
	if (!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullscreenEnabled || document.msFullscreenEnabled)) {
		console.warn(`Fullscreen NOT supported`);
		return;
	}
	console.log(`Fullscreen supported`);
	
	fullscreen = {};
	
	document.addEventListener(`DOMContentLoaded`, function() {
		// Get element associated with script.
		const element = document.getElementById(`fullscreen`);
		
		// Show record button.
		element.removeAttribute(`hide`);
		
		let isActive = document.fullscreenElement != null;
		
		document.addEventListener(`fullscreenchange`, function() {
			isActive = (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
		});
		
		fullscreen.activate = function() {
			const element = document.documentElement || document.body;
			// Supports most browsers and their versions.
			const method = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
			if (method) {
				isActive = true;
				// Native full screen.
				method.call(element);
			}
		};
		
		fullscreen.deactivate = function() {
			if (document.exitFullscreen) {
				isActive = false;
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				isActive = false;
				document.webkitExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				isActive = false;
				document.mozCancelFullScreen();
			} else if (document.msExitFullscreen) {
				isActive = false;
				document.msExitFullscreen();
			}
		};
		
		// Add toggle function to button.
		element.addEventListener(`click`, function() {
			if (!isActive) {
				fullscreen.activate();
			} else {
				fullscreen.deactivate();
			}
		});
	});
})();