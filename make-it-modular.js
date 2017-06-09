 var filterMod = require('./mymodule.js');
 var filePath = process.argv[2];
 var extStr = process.argv[3];

 filterMod(filePath, extStr, function(err, data) {
     if (err) {
         console.log("ERROR");
     } else {
         data.forEach(function(d) {
             console.log(d.toString());
         });
     }
 });