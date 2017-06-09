var fs = require('fs');
var extension = "." + process.argv[3];

fs.readdir(process.argv[2], 'utf-8', function(err, files) {
    files.forEach(function (file) {
        if (file.slice(-extension.length) === extension) {
            console.log(file);
        }
    });
});