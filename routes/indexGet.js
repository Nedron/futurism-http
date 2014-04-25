(function() {
    'use strict';

    var fs = require('fs');


    /**
     * Serve index page to unknown requests
     */
    module.exports = function(req, res) {
        var index = 'client/index.html';
        fs.readFile(index, 'utf8', function (err, indexContent) {
            if(err) {
                throw new Error(err);
            }
            res.send(indexContent);
        });
    };


}());