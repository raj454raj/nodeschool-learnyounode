var http = require('http');
var response = http.get(process.argv[2], function(response) {
    response.setEncoding("utf-8").on("data", function(data) {
        console.log(data);
    });
});
