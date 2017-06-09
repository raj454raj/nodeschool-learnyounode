var fs = require("fs");
fs.readFile(process.argv[2], "utf-8", function(error, data) {
	console.log((data.match(/\n/g) || []).length);
});
