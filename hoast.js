// Node modules.
const { extname } = require(`path`);
// Hoast.
const Hoast = require(`hoast`);
// Hoast modules.
const read = Hoast.read,
	changed = require(`hoast-changed`),
	convert = require(`hoast-convert`),
	filter = require(`hoast-filter`);
// Modules for file minifications.
const CleanCSS = require(`clean-css`);
const minifyCSS = new CleanCSS({
		returnPromise: false
	}),
	minifyHTML = require(`html-minifier`),
	minifyJS = require(`uglify-js`);

const build = async function () {
	try {
		// Copy README file from hoast dependency.
		await Hoast(__dirname, {
			source: `node_modules/inkjs/dist`,
			destination: `src/scripts/app/libraries`
		})	.use(filter({
				patterns: `ink.js`
			}))
			.use(read())
			.process();
	} catch(error) {
		throw error;
	}
	
	try {
		Hoast(__dirname, {
			source: `src`,
			destination: `dst`
		})	.use(filter({
				invert: true,
				patterns: `**/*.ink`
			}))
			.use(changed())
			.use(read())
			// Minify the CSS, HTML, and JS files.
			.use(convert({
				engine: function(filePath, content) {
					// Get file extension.
					switch(extname(filePath)) {
					case `.css`:
						// Minify CSS.
						return minifyCSS.minify(content).styles;
					case `.html`:
						// Minify HTML.
						return minifyHTML.minify(content, {
							collapseWhitespace: true,
							minifyCSS: true,
							minifyJS: true,
							removeComments: true
						});
					case `.js`:
						// Minify JS.
						const result = minifyJS.minify(content);
						if (result.error) {
							console.warn(result.error);
							return content;
						}
						return result.code;
					}
					return content;
				},
				patterns: [
					`**/*.css`,
					`**/*.html`,
					`**/*.js`
				]
			}))
			.process();
	} catch(error) {
		throw error;
	}
};

build();