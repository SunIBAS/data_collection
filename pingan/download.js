var https = require('https');

function getUrl() {
    return new Promise(function (s,f) {
        var body = {
            "version": "2.0",
            "channel": "MobileH5",
            "requestId": "be7206da-40e6-1700-0079-9c5ae9ea3596",
            "cltplt": "h5",
            "cltver": "1.0",
            "aid": null,
            "sid": null,
            "ouid": null,
            "source": null,
            "body": {},
            "confName": "appNavigation",
            "confVersion": "1.000"
        };

        var bodyString = JSON.stringify(body);

        var headers = {
            'Content-Type': 'application/json',
            'Content-Length': bodyString.length
        };


        var options = {
            // host: 'm.stock.pingan.com',
            // port: 3005,
            // path: '/restapi/rest-config/configurationInfo/getConfig?_=' + (new Date().getTime()),
            method: 'POST',
            headers: headers
        };

        var req = https.request('https://m.stock.pingan.com/restapi/rest-config/configurationInfo/getConfig?_=' + (new Date().getTime()),
            options, function (res) {
                res.setEncoding('utf-8');

                var responseString = '';

                res.on('data', function (data) {
                    responseString += data;
                });

                res.on('end', function () {
                    //这里接收的参数是字符串形式,需要格式化成json格式使用
                    var resultObject = JSON.parse(responseString);
                    let url = responseString.results.AppRoutes.filter(_ => _.category === "数据类")[0].menus.filter(_ => _.title == '最新研报')[0].link;
                    s(url,resultObject);
                    // console.log(JSON.stringify(resultObject,'','\t'));
                });

                req.on('error', function (e) {
                    // TODO: handle error.
                    console.log('-----error-------', e);
                    f(e);
                });
            });
        req.write(bodyString);
        req.end();
    })
}

