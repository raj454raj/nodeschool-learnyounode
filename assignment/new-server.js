#!/usr/bin/env node
"use strict";

var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require("fs");
var port = 8000;
var filePath = process.argv[3];
var currentWindow = [];

var server = http.createServer(function(request, response) {
    if (request.url === "/log") {
        var WebSocketClient = require('websocket').client;
        var client = new WebSocketClient();
        client.on('connect', function(connection) {
            connection.on('error', function(error) {
                console.log("Connection Error: " + error.toString());
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

var wsServer = new WebSocketServer({httpServer: server});

wsServer.on('request', function(request) {
    var connection = request.accept('tailfsocket', request.origin);
    /* Show last 10 lines of the file on first request */
    if (currentWindow.length === 0) {
        fs.readFile(filePath, function (err, data) {
            if (err) throw err;
            currentWindow = data.toString().split("\n").slice(-11, -1);
            connection.sendUTF(currentWindow.join("\n") + "\n");
        });
    } else {
        connection.sendUTF(currentWindow.join("\n") + "\n");
    }

    fs.watchFile(filePath,
                 {persistent: true, interval: 100},
                 function (curr, prev) {
        var buffer = new Buffer(" ".repeat(10000));
        fs.read(fs.openSync(filePath, "r"), buffer, 0,
                curr.size - prev.size + 1,
                prev.size,
                function (err, bytesRead, buffer) {
            currentWindow.push.apply(currentWindow, buffer.toString().trim().split("\n"));
            currentWindow = currentWindow.slice(-10);
            connection.sendUTF(buffer.toString().trim() + "\n");
            buffer = new Buffer(" ".repeat(10000));
        });
    });
});
