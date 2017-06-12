var http = require('http');
var bl = require('bl');
var results = [null, null, null], count = 0;

function printContents() {
    count++;
    if (count != 3) return;
    for (var i = 0 ; i < 3 ; ++i) {
        console.log(results[i]);
    }
}

function getRequest(index) {
    http.get(process.argv[index], function (response) {
        response.pipe(bl(function(err, data) {
            results[index - 2] = data.toString();
            printContents();
        }));
    });
}

for (var i = 2 ; i < 5 ; ++i) {
    getRequest(i);
}