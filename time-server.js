var net = require('net');
var port = Number(process.argv[2]) || 8000;

function padTime(num) {
    return num < 10 ? num : "0" + num;
}

function getTimeStamp() {
    var today = new Date();
    return [today.getFullYear(),
           padTime(today.getMonth() + 1),
           padTime(today.getDate())].join("-") + " " +
           padTime(today.getHours()) + ":" + padTime(today.getMinutes());
}

var server = net.createServer(function (socket) {
    socket.end(getTimeStamp() + "\n");
});

server.listen(port);