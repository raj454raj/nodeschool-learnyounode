
module.exports = function(filePath, ext, callback) {
    var fs = require('fs');
    ext = "." + ext;
    fs.readdir(filePath, function(err, list) {
        if (err) {
            return callback(err);
        } else {
            callback(null, list.filter(function (file) {
                return (file.slice(-ext.length) === ext);
            }));
        }
    });
}