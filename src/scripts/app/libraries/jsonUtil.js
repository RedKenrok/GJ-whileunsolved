let jsonUtil = {};

(function() {
	`use strict`;
	
	jsonUtil.load = function(path, callback) {
		if (!path || !callback) {
			return;
		}
		
		let request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
		request.open(`GET`, path, true);
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == "200") {
				// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode.
				callback(JSON.parse(request.responseText));
			}
		};
		request.send(null);
	};
}());