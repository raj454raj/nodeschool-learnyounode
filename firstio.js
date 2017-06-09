var fs = require("fs");
var data = fs.readFileSync(process.argv[2], "utf-8");
console.log((data.match(/\n/g) || []).length);
