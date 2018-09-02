let input;

(function(){
	input = {};

	document.addEventListener(`DOMContentLoaded`, function() {
		// Get element associated with script.
		input.element = document.getElementById(`input`);
		input.fieldElement = document.getElementById(`field`);
		
		window.addEventListener(`load`, function() {
			input.enable = function() {
				input.element.removeAttribute('hide');
			};
			
			input.disable = function() {
				input.element.setAttribute('hide', true);
			};
			
			input.fieldElement.addEventListener(`keyup`, function(event) {
				event.preventDefault();
				// Check i enter key pressed.
				if (event.keyCode !== 13) {
					return;
				}
				
				// Dispatch event.
				input.element.dispatchEvent(new CustomEvent(`end`, {
					detail: {
						query: input.fieldElement.value
					}
				}));
				
				// Clear input field.
				input.fieldElement.value = '';
			});
			
			// Check if recognition is available.
			if (recognition) {
				recognition.element.addEventListener(`available`, function() {
					input.fieldElement.style.width = `calc(100% - 10px - var(--button-size))`;
					input.fieldElement.style.paddingLeft = `var(--button-size)`;
				});
				
				recognition.element.addEventListener(`start`, function() {
					// Clear input field.
					input.fieldElement.value = '';
				});
				
				recognition.element.addEventListener(`result`, function(event) {
					// Display current recognized speech.
					let text = event.detail.transcript || '';
					if (event.detail.interim) {
						text += event.detail.interim;
					}
					input.fieldElement.value = text;
				});
				
				recognition.element.addEventListener(`end`, function(event) {
					// Dispatch event.
					input.element.dispatchEvent(new CustomEvent(`end`, {
						detail: {
							query: event.detail.transcript || ''
						}
					}));
					
					// Clear input field.
					input.fieldElement.value = '';
				});
			}
		});
	});
})();