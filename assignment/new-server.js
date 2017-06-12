#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require("fs");
var port = 8000;
var filePath = process.argv[3];

var server = http.createServer(function(request, response) {
    if (request.url === "/log") {
        var WebSocketClient = require('websocket').client;
        var client = new WebSocketClient();
        client.on('connect', function(connection) {
            console.log('WebSocket Client Connected');
            connection.on('error', function(error) {
                console.log("Connection Error: " + error.toString());
            });
            connection.on('close', function() {
                console.log('echo-protocol Connection Closed');
            });
            connection.on('message', function(message) {
                response.end(message.utf8Data);
            });
        });
        fs.readFile("index.html", function(err, data){
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data);
            response.end();
        });
    } else {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("Invalid path");
    }
});

server.listen(port);

wsServer = new WebSocketServer({httpServer: server});

wsServer.on('request', function(request) {
    var connection = request.accept('tailfsocket', request.origin);
        /* Show initial contents of file on first request */
    fs.readFile(filePath, function (err, data) {
        if (err) throw err;
        connection.sendUTF(data);
        var fd = fs.openSync(filePath, "r");
        fs.watchFile(filePath,
                     {persistent: true, interval: 100},
                     function (curr, prev) {
            var buffer = new Buffer(" ".repeat(10000));
            fs.read(fd, buffer, 0,
                    curr.size - prev.size + 1,
                    prev.size,
                    function (err, bytesRead, buffer) {
                connection.sendUTF(buffer.toString().trim() + "\n");
                buffer = new Buffer(" ".repeat(10000));
            });
        });
    });
});
