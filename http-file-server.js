var http = require('http');
var fs = require('fs');
var port = process.argv[2];
var filePath = process.argv[3];

var server = http.createServer(function (request, response) {
    var srcStream = fs.createReadStream(filePath);
    // response object is also a stream
    srcStream.pipe(response);
});
server.listen(port);