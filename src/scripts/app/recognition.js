let recognition;

(function(){
	if (!(`webkitSpeechRecognition` in window)) {
		console.warn(`Speech recognition NOT supported`);
		return;
	}
	console.log(`Speech recognition supported`);
	
	recognition = {};
	
	document.addEventListener(`DOMContentLoaded`, function() {
		// Get element associated with script.
		recognition.element = document.getElementById(`recognition`);
		
		// Show record button.
		recognition.element.removeAttribute(`hide`);
		
		// Whether to enable the recognition.
		let enabled = false;
		
		// Most recent transcript.
		let transcript = ``;
		// Most recent transcript, still possible to change.
		let transcript_interim = ``;
		
		// Sets up webkit.
		const speechRecognition = new webkitSpeechRecognition();
		speechRecognition.lang = `en-GB`;
		speechRecognition.interimResults = true; // onresult will also contain non-final text.
		
		// On start
		speechRecognition.onstart = function() {
			console.log(`recognition start`);
			
			// Trigger start event.
			recognition.element.dispatchEvent(new CustomEvent(`start`));
		};
		// On end
		speechRecognition.onend = function() {
			console.log(`recognition end: ` + transcript);
			
			// Re-enable speech recognition.
			recognition.enable();
			
			// Trigger end event.
			recognition.element.dispatchEvent(new CustomEvent(`end`, {
				detail: {
					transcript: transcript
				}
			}));
		};
		// On error
		speechRecognition.onerror = function(event) {
			console.log(`recognition error`);
			if (event.error == `no-speech`) {
				console.error(`no speech`);
			} else if (event.error == `audio-capture`) {
				console.error(`no microphone`);
			} else if (event.error == `not-allowed`) {
				console.error(`not allowed`);
			} else {
				console.error(event.error);
			}
		};
		// On result
		speechRecognition.onresult = function(event) {
			console.log(`recognition result`);
			// Clears interim transcript.
			transcript_interim = ``;
			// Loop through results
			for (let i = event.resultIndex; i < event.results.length; i++) {
				// If result is final or interim.
				if (event.results[i].isFinal) {
					transcript += event.results[i][0].transcript;
				}
				else {
					transcript_interim += event.results[i][0].transcript;
				}
			}
			
			recognition.element.dispatchEvent(new CustomEvent(`result`, {
				detail: {
					transcript: transcript,
					interim: transcript_interim
				}
			}));
		};
		
		recognition.enable = function() {
			enabled = true;
		};
		
		recognition.disable = function() {
			enabled = false;
		}
		
		// Start recording on button click.
		recognition.element.addEventListener(`click`, function() {
			// If disabled return.
			if (!enabled) {
				return;
			}
			recognition.disable();
			
			// Cancel current synthesis
			if (synthesis) {
				synthesis.cancel();
			}
			
			// Clear transcript.
			transcript = ``;
			speechRecognition.start();
		});
		
		// After initialization allow recognition to be used.
		recognition.enable();
		
		window.addEventListener(`load`, function() {
			recognition.element.dispatchEvent(new CustomEvent(`available`));
		});
	});
})();