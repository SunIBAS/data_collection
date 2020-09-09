let req = function (page) {
    let e = "http://b2b-api.10jqka.com.cn/gateway/arsenal/datacenter.news/get_report_info"
    let n = {
        "cate": "latest",
        "page": page,
        "type": "api",
        "method": "report_data"
    };
    let t = (function o() {
        for (var e = window.location.href, n = e.length, t = e.substring(e.indexOf("?") + 1, n).split("&"), o = {}, i = 0; i < t.length; i++)
            t[i] = t[i].split("="),
                o[t[i][0]] = t[i][1];
        return o
    })();
    return new Promise(function(o, i) {
        var r = {
            apiPath: e,
            type: "post",
            data: n,
            async: !0,
            cache: !1,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            ready: function(e) {
                if ("string" == typeof e && (e = JSON.parse(e)),
                0 === e.status_code)
                    o(e);
                else if (1401 === Number(e.flag)) {
                    var n = {
                        cid: t.ckey,
                        ready: function() {
                            window.openApi.prepareAjax(r)
                        },
                        error: function() {
                            i(e)
                        }
                    };
                    window.openApi.config(n)
                } else
                    i(e)
            },
            error: function(e) {
                i(e)
            }
        };
        window.openApi.prepareAjax(r)
    });
}

let fromPage = 1;

let today = (function () {
    let d = new Date();
    let m = d.getMonth() + 1;
    let day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? '0':'') + m + "-" + (day < 10 ? '0':'') + day;

})();


let over = false;
let datas = [];
let doit = function () {
    if (over) {
        alert('结束');
        return;
    }
    req(fromPage)
        .then(_ => {
            _.data.forEach(info => {
                if (info.date !== today) {
                    over = true;
                }
                datas.push(info);
            });
            if (over) {
                alert('结束');
            } else {
                fromPage++;
                setTimeout(doit,100);
            }
        });
}
setTimeout(doit,100);


function funDownload(filename) {
    // content = "a,b,c,d\r\n1,2,3,4"
    let content = "";
    if (filename.endsWith('.js')) {
        content = JSON.stringify(datas,'','');
    } else if (filename.endsWith('.csv')) {
        content = "日期,类型,今日最新价,No,姓名,准确率,目标价格,原因,股票,down\r\n";
        datas.forEach(d => {
            content += `${d.date},${d.level},${d.price},${d.grade},${d.name},${d.accuracy},${d.up},${d.title},${d.stock},${d.down}\r\n`;
        });
    }
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
}

