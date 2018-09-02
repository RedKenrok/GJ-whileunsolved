let synthesis;

(function(){
	// Is synthesizer available.
	if (!`speechSynthesis` in window) {
		console.warn(`Speech synthesis NOT supported`);
		return;
	}
	console.log(`Speech synthesis supported`);

	synthesis = {};
	
	// Icon classes.
	const iconOn = `fa-volume-up`;
	const iconOff = `fa-volume-off`;
	
	document.addEventListener(`DOMContentLoaded`, function() {
		// Whether the speech synthesizer is muted.
		let isMuted = false;
		// Speaking queue.
		let queue = [];
		
		// Get element associated with script.
		synthesis.element = document.getElementById(`synthesis`);
		// Show record button.
		synthesis.element.removeAttribute(`hide`);
		// Get speaker icon.
		const iconElement = synthesis.element.firstElementChild;
		
		// Add icon to button.
		iconElement.classList.add(isMuted ? iconOff : iconOn);
		
		// Get voices.
		let voices = window.speechSynthesis.getVoices();
		
		// Create and configure base message.
		const message = new SpeechSynthesisUtterance();
		message.lang = `en-GB`;
		message.volume = 0.5;
		message.rate = 1.6;
		message.pitch = 1.6;
		
		synthesis.setDefaultVoice = function() {
			// Get voices that match the message language.
			let compatibleVoices = voices.filter(function(voice) {
				return voice.lang == message.lang;
			});
			
			// Check if any found.
			if (compatibleVoices.length == 0) {
				return;
			}
			
			// Set first in list as voice to use.
			synthesis.setVoice(compatibleVoices[0]);
		};
		synthesis.setDefaultVoice();
		
		const speak = function(transcript) {
			// Speak transcript.
			message.text = transcript;
			window.speechSynthesis.speak(message);
		};
		
		const slice = function(text, length = 200) {
			// Check if character at index is a space.
			const isSpace = function(text, index) {
				return /\s/.test(text.charAt(index));
			};
			
			// Get index of last space in text.
			const lastIndexOfSpace = function(text, left, right) {
				for (let i = right; i >= left; i--) {
					if (isSpace(text, i)) {
						return i;
					}
				}
				return -1; // not found
			};
			
			let textSlices = [];
			let start = 0;
			for (;;) {
				// Check transcript's length, if less than maximum end of transcript has been reached.
				if (text.length - start <= length) {
					textSlices.push(text.slice(start, text.length));
					break;
				}
				
				// Check whether the word is cut in the middle.
				let end = start + length - 1;
				if (isSpace(text, end) || isSpace(text, end + 1)) {
					textSlices.push(text.slice(start, end + 1));
					start = end + 1;
					continue;
				}
				
				// Find last index of space
				end = lastIndexOfSpace(text, start, end);
				if (end === -1) {
					this.emit('error', 'Character count of single word is over the max length of ' + length + '.');
				}
				
				// Add to array
				textSlices.push(text.slice(start, end + 1));
				start = end + 1;
			}
			return textSlices;
		};
		
		window.speechSynthesis.onvoiceschanged = function() {
			// Override voices with new async loaded voices.
			voices = window.speechSynthesis.getVoices();
			
			// Dispatch voices changed event.
			synthesis.element.dispatchEvent(new CustomEvent(`voices_changed`));
		};
		
		message.onend = function() {
			// Check if queue finished.
			if (queue.length == 0) {
				// Dispatch end event.
				synthesis.element.dispatchEvent(new CustomEvent(`end`));
				return;
			}
			
			// Speak first in queue.
			speak(queue.shift());
		};
		
		message.onerror = function(event) {
			console.error(event.error);
		};
		
		message.onstart = function() {
			// Dispatch start event.
			synthesis.element.dispatchEvent(new CustomEvent(`start`));
		};
		
		synthesis.cancel = function() {
			// Cancel current message.
			window.speechSynthesis.cancel();
		};
		
		synthesis.getVoices = function() {
			// Return all currently available voices.
			return voices;
		};
		
		synthesis.setVoice = function(voice) {
			// Set voice for message.
			message.voice = voice;
		}
		
		synthesis.speak = function(transcript) {
			// Do not play if muted.
			if (isMuted) {
				// Dispatch end event.
				synthesis.element.dispatchEvent(new CustomEvent(`end`));
				return;
			}
			
			// Divide transcript
			transcript = slice(transcript, 200);
			// Push all sections to queue.
			for (let i = 0; i < transcript.length; i++) {
				queue.push(transcript[i]);
			}
			
			// Check if currently speaking.
			if (window.speechSynthesis.speaking) {
				return;
			}
			
			// Speak first in queue.
			speak(queue.shift());
		}
		
		// Toggle muting on button click.
		synthesis.element.addEventListener(`click`, function() {
			// Invert mute.
			isMuted = !isMuted;
			
			// If muted.
			if (isMuted) {
				synthesis.cancel();
				queue = [];
				
				iconElement.classList.remove(iconOn);
				iconElement.classList.add(iconOff);
				return;
			}
			
			// If not muted.
			iconElement.classList.remove(iconOff);
			iconElement.classList.add(iconOn);
		});
	});
})();