var http = require("http");
var url = require("url");
var port = process.argv[2];

var server = http.createServer(function (request, response) {
    response.setHeader("Content-Type", "application/json");
    var thisURL = url.parse(request.url, true);

    if (request.method !== "GET") {
        response.end(JSON.stringify({"result": "Only GET requests are accepted"}));
    } else {
        if (thisURL.pathname === "/api/parsetime" && thisURL.query.iso) {
            var timestamp = new Date(thisURL.query.iso);
            response.end(JSON.stringify({"hour": timestamp.getHours(),
                                         "minute": timestamp.getMinutes(),
                                         "second": timestamp.getSeconds()}));
        } else if (thisURL.pathname === "/api/unixtime" && thisURL.query.iso) {
            var timestamp = new Date(thisURL.query.iso);
            response.end(JSON.stringify({"unixtime": timestamp.getTime()}));
        } else {
            response.end(JSON.stringify({"result": "Invalid route requested"}));
        }
    }
});

server.listen(port);