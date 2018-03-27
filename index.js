const http = require('http');
const fs = require('fs');
const staticBasePath = './public';

const htmlRequest = function (req, res) {
    const url = (req.url === '/') ? '/index.html' : req.url;
    fs.readFile(staticBasePath + url, function(err, data) {
        if (err)
            res.end('error');
        else
            res.end(data);
    });
};
const httpServer = http.createServer(htmlRequest);
httpServer.listen(3000);