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
var clientConnections = [];
wsServer.on('request', function(request) {
    var connection = request.accept('tailfsocket', request.origin);
    clientConnections.push(connection);
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
});

wsServer.on("close", function (webSocketConnection, closeReason, description) {
    console.log("connection closed");
});

// Watch the file and send the updates to every client connection
fs.watchFile(filePath,
             {persistent: true, interval: 100},
             function (curr, prev) {
    var buffer = new Buffer(" ".repeat(10000));
    fs.open(filePath, "r", function(err, fd) {
        fs.read(fd, buffer, 0,
                curr.size - prev.size + 1,
                prev.size,
                function (err, bytesRead, buffer) {
            var updates = buffer.toString().trim();
            currentWindow.push.apply(currentWindow, updates.split("\n"));
            currentWindow = currentWindow.slice(-10);
            for (var i = 0 ; i < clientConnections.length ; ++i) {
                if (!clientConnections[i].connected)
                    clientConnections.splice(i, 1);
                if (clientConnections[i])
                    clientConnections[i].sendUTF(updates + "\n");
            }
            buffer = new Buffer(" ".repeat(10000));
        });
    });
});