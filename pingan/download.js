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


var getSessionString = (function() {
    let n = {
        rotl: function(e, t) {
            return e << t | e >>> 32 - t
        },
        rotr: function(e, t) {
            return e << 32 - t | e >>> t
        },
        endian: function(e) {
            if (e.constructor == Number)
                return 16711935 & n.rotl(e, 8) | 4278255360 & n.rotl(e, 24);
            for (var t = 0; t < e.length; t++)
                e[t] = n.endian(e[t]);
            return e
        },
        randomBytes: function(e) {
            for (var t = []; e > 0; e--)
                t.push(Math.floor(256 * Math.random()));
            return t
        },
        bytesToWords: function(e) {
            for (var t = [], i = 0, n = 0; i < e.length; i++,
                n += 8)
                t[n >>> 5] |= e[i] << 24 - n % 32;
            return t
        },
        wordsToBytes: function(e) {
            for (var t = [], i = 0; i < 32 * e.length; i += 8)
                t.push(e[i >>> 5] >>> 24 - i % 32 & 255);
            return t
        },
        bytesToHex: function(e) {
            for (var t = [], i = 0; i < e.length; i++)
                t.push((e[i] >>> 4).toString(16)),
                    t.push((15 & e[i]).toString(16));
            return t.join("")
        },
        hexToBytes: function(e) {
            for (var t = [], i = 0; i < e.length; i += 2)
                t.push(parseInt(e.substr(i, 2), 16));
            return t
        },
        bytesToBase64: function(e) {
            for (var t = [], n = 0; n < e.length; n += 3)
                for (var r = e[n] << 16 | e[n + 1] << 8 | e[n + 2], o = 0; o < 4; o++)
                    8 * n + 6 * o <= 8 * e.length ? t.push(i.charAt(r >>> 6 * (3 - o) & 63)) : t.push("=");
            return t.join("")
        },
        base64ToBytes: function(e) {
            e = e.replace(/[^A-Z0-9+\/]/gi, "");
            for (var t = [], n = 0, r = 0; n < e.length; r = ++n % 4)
                0 != r && t.push((i.indexOf(e.charAt(n - 1)) & Math.pow(2, -2 * r + 8) - 1) << 2 * r | i.indexOf(e.charAt(n)) >>> 6 - 2 * r);
            return t
        }
    };
    let s = function(t, i) {
        stringToBytes = function(e) {
            bin_stringToBytes = function(e) {
                for (var t = [], i = 0; i < e.length; i++)
                    t.push(255 & e.charCodeAt(i));
                return t
            }
            return bin_stringToBytes(unescape(encodeURIComponent(e)))
        }
        t.constructor == String ? t = i && "binary" === i.encoding ? a.stringToBytes(t) : stringToBytes(t) : o(t) ? t = Array.prototype.slice.call(t, 0) : Array.isArray(t) || (t = t.toString());
        for (var s = n.bytesToWords(t), l = 8 * t.length, u = 1732584193, c = -271733879, d = -1732584194, f = 271733878, h = 0; h < s.length; h++)
            s[h] = 16711935 & (s[h] << 8 | s[h] >>> 24) | 4278255360 & (s[h] << 24 | s[h] >>> 8);
        s[l >>> 5] |= 128 << l % 32,
            s[14 + (l + 64 >>> 9 << 4)] = l;
        var p = e._ff
            , g = e._gg
            , m = e._hh
            , y = e._ii;
        for (h = 0; h < s.length; h += 16) {
            var v = u
                , A = c
                , _ = d
                , E = f;
            u = p(u, c, d, f, s[h + 0], 7, -680876936),
                f = p(f, u, c, d, s[h + 1], 12, -389564586),
                d = p(d, f, u, c, s[h + 2], 17, 606105819),
                c = p(c, d, f, u, s[h + 3], 22, -1044525330),
                u = p(u, c, d, f, s[h + 4], 7, -176418897),
                f = p(f, u, c, d, s[h + 5], 12, 1200080426),
                d = p(d, f, u, c, s[h + 6], 17, -1473231341),
                c = p(c, d, f, u, s[h + 7], 22, -45705983),
                u = p(u, c, d, f, s[h + 8], 7, 1770035416),
                f = p(f, u, c, d, s[h + 9], 12, -1958414417),
                d = p(d, f, u, c, s[h + 10], 17, -42063),
                c = p(c, d, f, u, s[h + 11], 22, -1990404162),
                u = p(u, c, d, f, s[h + 12], 7, 1804603682),
                f = p(f, u, c, d, s[h + 13], 12, -40341101),
                d = p(d, f, u, c, s[h + 14], 17, -1502002290),
                u = g(u, c = p(c, d, f, u, s[h + 15], 22, 1236535329), d, f, s[h + 1], 5, -165796510),
                f = g(f, u, c, d, s[h + 6], 9, -1069501632),
                d = g(d, f, u, c, s[h + 11], 14, 643717713),
                c = g(c, d, f, u, s[h + 0], 20, -373897302),
                u = g(u, c, d, f, s[h + 5], 5, -701558691),
                f = g(f, u, c, d, s[h + 10], 9, 38016083),
                d = g(d, f, u, c, s[h + 15], 14, -660478335),
                c = g(c, d, f, u, s[h + 4], 20, -405537848),
                u = g(u, c, d, f, s[h + 9], 5, 568446438),
                f = g(f, u, c, d, s[h + 14], 9, -1019803690),
                d = g(d, f, u, c, s[h + 3], 14, -187363961),
                c = g(c, d, f, u, s[h + 8], 20, 1163531501),
                u = g(u, c, d, f, s[h + 13], 5, -1444681467),
                f = g(f, u, c, d, s[h + 2], 9, -51403784),
                d = g(d, f, u, c, s[h + 7], 14, 1735328473),
                u = m(u, c = g(c, d, f, u, s[h + 12], 20, -1926607734), d, f, s[h + 5], 4, -378558),
                f = m(f, u, c, d, s[h + 8], 11, -2022574463),
                d = m(d, f, u, c, s[h + 11], 16, 1839030562),
                c = m(c, d, f, u, s[h + 14], 23, -35309556),
                u = m(u, c, d, f, s[h + 1], 4, -1530992060),
                f = m(f, u, c, d, s[h + 4], 11, 1272893353),
                d = m(d, f, u, c, s[h + 7], 16, -155497632),
                c = m(c, d, f, u, s[h + 10], 23, -1094730640),
                u = m(u, c, d, f, s[h + 13], 4, 681279174),
                f = m(f, u, c, d, s[h + 0], 11, -358537222),
                d = m(d, f, u, c, s[h + 3], 16, -722521979),
                c = m(c, d, f, u, s[h + 6], 23, 76029189),
                u = m(u, c, d, f, s[h + 9], 4, -640364487),
                f = m(f, u, c, d, s[h + 12], 11, -421815835),
                d = m(d, f, u, c, s[h + 15], 16, 530742520),
                u = y(u, c = m(c, d, f, u, s[h + 2], 23, -995338651), d, f, s[h + 0], 6, -198630844),
                f = y(f, u, c, d, s[h + 7], 10, 1126891415),
                d = y(d, f, u, c, s[h + 14], 15, -1416354905),
                c = y(c, d, f, u, s[h + 5], 21, -57434055),
                u = y(u, c, d, f, s[h + 12], 6, 1700485571),
                f = y(f, u, c, d, s[h + 3], 10, -1894986606),
                d = y(d, f, u, c, s[h + 10], 15, -1051523),
                c = y(c, d, f, u, s[h + 1], 21, -2054922799),
                u = y(u, c, d, f, s[h + 8], 6, 1873313359),
                f = y(f, u, c, d, s[h + 15], 10, -30611744),
                d = y(d, f, u, c, s[h + 6], 15, -1560198380),
                c = y(c, d, f, u, s[h + 13], 21, 1309151649),
                u = y(u, c, d, f, s[h + 4], 6, -145523070),
                f = y(f, u, c, d, s[h + 11], 10, -1120210379),
                d = y(d, f, u, c, s[h + 2], 15, 718787259),
                c = y(c, d, f, u, s[h + 9], 21, -343485551),
                u = u + v >>> 0,
                c = c + A >>> 0,
                d = d + _ >>> 0,
                f = f + E >>> 0
        }
        return n.endian([u, c, d, f])
    }
    let e = {};
    e._ff = function(e, t, i, n, r, o, a) {
        var s = e + (t & i | ~t & n) + (r >>> 0) + a;
        return (s << o | s >>> 32 - o) + t
    }
    e._gg = function(e, t, i, n, r, o, a) {
        var s = e + (t & n | i & ~n) + (r >>> 0) + a;
        return (s << o | s >>> 32 - o) + t
    }
    e._hh = function(e, t, i, n, r, o, a) {
        var s = e + (t ^ i ^ n) + (r >>> 0) + a;
        return (s << o | s >>> 32 - o) + t
    }
    e._ii = function(e, t, i, n, r, o, a) {
        var s = e + (i ^ (t | ~n)) + (r >>> 0) + a;
        return (s << o | s >>> 32 - o) + t
    }
    const mm = (e, t) => {
        if(null==e) throw new Error("Illegal argument "+e);
        let wordsToBytes = function(e) {
            for (var t = [], i = 0; i < 32 * e.length; i += 8)
                t.push(e[i >>> 5] >>> 24 - i % 32 & 255);
            return t
        }
        var i = wordsToBytes(s(e,t));
        return t&&t.asBytes?i:t&&t.asString?a.bytesToString(i):n.bytesToHex(i)
    };
    // mm(String('7736C06C-2D41-4CAD-A0C5-912472655054138364infoc'.toString(16) + Date.now()))
    return function () {
        return mm(String(
            document.cookie.split(';').map(_ => _.trim().split('=')).filter(_ => _[0] === 'buvid3')[0][1].toString(16) + Date.now()
        ));
    }
})();