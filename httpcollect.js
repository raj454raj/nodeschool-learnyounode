var http = require('http');
var bl = require('bl');

http.get(process.argv[2], function(response) {
    response.pipe(bl(function (err, data) {
        var completeData = data.toString();
        console.log(completeData.length);
        console.log(completeData);
    }));
});