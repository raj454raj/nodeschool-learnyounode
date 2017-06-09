var http = require('http');
var bl = require('bl');

// Very very ugly code
http.get(process.argv[2], function(response) {
    response.pipe(bl(function (err, data1) {
        http.get(process.argv[3], function(response) {
            response.pipe(bl(function (err, data2) {
                http.get(process.argv[4], function(response) {
                    response.pipe(bl(function (err, data3) {
                        console.log(data1.toString());
                        console.log(data2.toString());
                        console.log(data3.toString());
                    }));
                });
            }));
        });
    }));
});
