let messenger;

(function(){
	messenger = {};
	
	const choiceClassName = `choice`;
	const listQuery = `#messenger > li`;
	
	const templateText = `<li class="fade">{0}</li>`;
	const templateChoice = `<li class="${choiceClassName} fade"><span onclick="messenger.selected({0});">- {1}</span></li>`;
	
	document.addEventListener(`DOMContentLoaded`, function() {
		const removeElementsByClassName = function(className) {
			// Remove all elements with that class.
			const elements = document.getElementsByClassName(className);
			const elementsLength = elements.length;
			for (let i = 0; i < elementsLength; i++) {
				elements[0].parentElement.removeChild(elements[0]);
			}
		}
		const scrollElementsInView = function(query) {
			// Scroll last element into view.
			const elements = document.querySelectorAll(query);
			elements[elements.length - 1].scrollIntoView();
		}
		
		messenger.element = document.getElementById(`messenger`);
		
		messenger.addText = function(transcript) {
			messenger.element.insertAdjacentHTML(`beforeend`, templateText.format(transcript));
			scrollElementsInView(listQuery);
		};
		
		const addChoice = function(index, text) {
			messenger.element.insertAdjacentHTML(`beforeend`, templateChoice.format(index, text));
		};
		
		messenger.addChoices = function(texts) {
			for (let i = 0; i < texts.length; i++) {
				addChoice(i, texts[i]);
			}
			scrollElementsInView(listQuery);
		};
		
		messenger.selected = function(index) {
			removeElementsByClassName(choiceClassName);
			messenger.element.dispatchEvent(new CustomEvent(`selected`, {
				detail: {
					index: index
				}
			}));
		};
	});
})();