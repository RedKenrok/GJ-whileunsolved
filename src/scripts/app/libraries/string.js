if (!String.prototype.format) {
	String.prototype.format = function() {
		let args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	};
}
if (!String.prototype.indexOfNth) {
	String.prototype.indexOfNth = function(substring, index) {
		index = this.split(substring, index + 1).join(substring).length;
		return index === this.length ? -1 : index + 1;
	}
}