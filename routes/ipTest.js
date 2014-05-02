'use strict';

module.exports = {
    get: function(req, res) {
        res.apiOut(null, {
            ip: req.ip,
            cloudflare: req.header('HTTP_CF_CONNECTING_IP'),
            forwarded: req.header('x-forwarded-for'),
            remoteAddress: req.connection.remoteAddress
        });
    }
};