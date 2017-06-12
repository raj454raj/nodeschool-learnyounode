var http = require("http");
var fs = require("fs");
var port = process.argv[2];
var filePath = process.argv[3];

var server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});

    /* Show initial contents of file on first request */
    fs.readFile(filePath, function (err, data) {
        if (err) throw err;
        response.write(data);
        var fd = fs.openSync(filePath, "r");

        fs.watchFile(filePath,
                     {persistent: true, interval: 100},
                     function (curr, prev) {
            console.log("File updated ...");
            var buffer = new Buffer(" ".repeat(10000));
            fs.read(fd, buffer, 0,
                    curr.size - prev.size + 1,
                    prev.size,
                    function (err, bytesRead, buffer) {
                response.write(buffer.toString().trim() + "\n");
                buffer = new Buffer(" ".repeat(10000));
            });
        });
    });
});

server.listen(port);
console.log("Server listening on " + port + " ...");

