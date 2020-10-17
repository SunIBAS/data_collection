// 创建一个 ftp 服务
var Client = require('ftp');

var c = newClient();

c.on('ready', function() {
    c.list(function(err, list) {
        if(err) throwerr;
        console.dir(list);
        c.end();
    });
});
