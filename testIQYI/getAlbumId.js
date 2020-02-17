const https = require("https");
const fs = require('fs');
// 获取全国每日变化

https.get(" https://pcw-api.iqiyi.com/albums/album/avlistinfo?aid=241284401&page=1&size=30&callback=j",(resp) => {
    let data = '';
    resp.on('data',(chunk) => data += chunk);
    resp.on('end',() => {
        data = data.replace('try{ j(','')
            .replace(');}catch(e){}','');
        data = JSON.parse(data);
        data = data.data.epsodelist.map(_ => {
            return {
                order: _.order,
                playUrl: _.playUrl,
                name: _.name,
                subtitle: _.subtitle
            }
        });
        console.log(JSON.stringify(data,'','\t'));
    });
    resp.on("error",console.log);
});
