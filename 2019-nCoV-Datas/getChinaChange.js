const https = require("https");
const fs = require('fs');
// 获取全国每日变化

https.get("https://view.inews.qq.com/g2/getOnsInfo?name=wuwei_ww_cn_day_counts",(resp) => {
    let data = '';
    resp.on('data',(chunk) => data += chunk);
    resp.on('end',() => {
        let d = JSON.parse(JSON.parse(data).data)
            .map(_ => {
                _.ind = _.date.split('/').join('0');
                return _;
            })
            .sort((a,b) => a.ind - b.ind);
        fs.writeFileSync('datas/china.json',JSON.stringify(d,'','\t'));
    });
    resp.on("error",console.log);
});
