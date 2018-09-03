(function(){
	const storyPath = `data/story.ink.json`;
	const databasePath = `data/database.json`;
	
	// Prefix added to ink markers if a entry has been discovered.
	const DATABASE_PREFIX = `database_`;
	
	const CHOICE_SEARCH_DATABASE = `Search database`;
	
	const SPEAK_DATABASE_START = [
		`Just then I might have realized something and decided to check the database.`,
		`"Aha!" I exclaimed as I decided to search through the database.`,
		`Perhaps looking through the database could provide me with a new lead.`
	];
	const SPEAK_DATABASE_RESULT = [
		`"Aha!" I exclaimed after seeing a result appear.`,
		`Delighted I was when a result showed up on the screen.`,
		`A search result! I felt like I was really onto something here.`
	];
	const SPEAK_DATABASE_EMPTY = [
		`Unfortunatly no results appeared.`,
		`No relevent search results came up.`,
		`Nothing, perhaps another search term should do it.`
	];
	
	const randomInt = function(max) {
		// Return random number between zero, inclusive, and the max, exculsive.
		const number = Math.floor(Math.random() * Math.floor(max))
		return number == max ? max - 1 : number;
	};
	
	window.addEventListener(`load`, function() {
		// If voice list changes reconfigure to a default compatible option.
		if (synthesis !== null) {
			synthesis.element.addEventListener(`voices_changed`, synthesis.setDefaultVoice);
		}
		
		jsonUtil.load(window.location + storyPath, function(data) {
			const story = new inkjs.Story(data);
			
			jsonUtil.load(window.location + databasePath, function(database) {
				const output = function(text) {
					// Output and sythezise text.
					messenger.addText(text);
					if (synthesis) {
						synthesis.speak(text);
					}
				};
				
				const next = function() {
					if (!story.canContinue && story.currentChoices.length === 0) {
						console.log(`End of story reached.`);
						return;
					}
					
					if (story.canContinue) {
						// Get line of text.
						let text = story.Continue().trim();
						
						if (text) {
							// Output text.
							output(text);
						}
						
						// Continue story.
						next();
						return;
					}
					
					if (story.currentChoices.length > 0) {
						// Display options.
						messenger.addChoices(story.currentChoices.map(function(choice) {
							return choice.text;
						}));
						
						// Handle when a choice is made.
						const onChoiceSelected = function(event) {
							// Remove self after done.
							messenger.element.removeEventListener(`selected`, onChoiceSelected);
							
							// Clear ongoing speech synthesis.
							if (synthesis) {
								synthesis.clearQueue();
							}
							
							// Get index and choice.
							const index = event.detail.index;
							choice = story.currentChoices[index];
							
							// Select choice in ink.
							story.ChooseChoiceIndex(index);
							
							// Check if option is not special database search option.
							if (choice.text !== CHOICE_SEARCH_DATABASE) {
								next();
								return;
							}
							
							// Activate input field.
							input.enable();
							
							// Output and sythezise transcript.
							output(SPEAK_DATABASE_START[randomInt(SPEAK_DATABASE_START.length)]);
							
							const onInputEnd = function(event) {
								// Remove self after done.
								input.element.removeEventListener(`end`, onInputEnd);
								// Deactivate input field.
								input.disable();
								
								const query = event.detail.query.toLowerCase();
								const matchingEntries = database.filter(function(entries) {
									for (let i = 0; i < entries.terms.length; i++) {
										if (entries.terms[i].toLowerCase() === query) {
											return true;
										}
									}
									return false;
								});
								
								if (matchingEntries.length > 0) {
									const matchingEntry = matchingEntries[0];
									
									// Output and sythezise transcript.
									output(SPEAK_DATABASE_RESULT[randomInt(SPEAK_DATABASE_RESULT.length)]);
									
									// Set id to ink state.
									story.variablesState.$(DATABASE_PREFIX.concat(matchingEntry.id.toLowerCase()), true);
									
									// Output database result.
									output(matchingEntry.content);
								} else {
									// Get a empty message.
									output(SPEAK_DATABASE_EMPTY[randomInt(SPEAK_DATABASE_EMPTY.length)]);
								}
								
								// Continue story.
								next();
							};
							
							input.element.addEventListener(`end`, onInputEnd);
						};
						// Listen for an option to be selected.
						messenger.element.addEventListener(`selected`, onChoiceSelected);
					}
				};
				
				// Start first cycle.
				next();
			});
		});
	});
})();