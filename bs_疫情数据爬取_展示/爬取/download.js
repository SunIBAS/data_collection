// const {
//     get
// } = require('./../../_utils/Ajax');
const https = require("https");
const http = require('http');
const fs = require('fs');

/**
 * @return Promise
 * */
const get = function(url,option) {
    option = option || {};
    const httpGet = http.get.bind(http);
    const httpsGet = https.get.bind(https);
    let getMethod = (function (url) {
        if (url.startsWith('http://')) {
            return httpGet;
        } else if (url.startsWith('https://')) {
            return httpsGet;
        }
    })(url);
    return new Promise(function (scb,fcb) {
        getMethod(url,option,(resp) => {
            let data = '';
            resp.on('data',(chunk) => {
                data += chunk
            });
            resp.on('end',() => {
                scb(data);
            });
            resp.on("error",fcb);
        });
    })
};
class Utils {
    // 处理 导航 数据
    static dearWithNav(txt) {
        // let txt = fs.readFileSync('./nav.txt','utf-8');
        txt = txt.replace(/document\.writeln\("[ \t]+/g,'');
        let txtSp = txt.split('\r\n');
        let i = 0;
        for (;i < txtSp.length;i++) {
            if (txtSp[i] === 'document.writeln("");') {
                break;
            }
        }

        const getLinkAndName = str => {
            // console.log(str);
            // 匹配汉字
            let name = str.match(/[\u4e00-\u9fa5]+/);
            if (name) {
                name = name[0];
            } else {
                return null;
            }
            //
            let link = str.match(/href=\\'[a-zA-Z?.=\/0-9]+/)[0].substring(7);
            return {name,link};
        }

        let citys = [];
        for (;i < txtSp.length;i += 10) {
            // pName = `<li><a href=\\'/covid/list.asp?id=439\\'><b>湖北</b></a></li>`;
            let pName = getLinkAndName(txtSp[i + 9].split('"')[0]);
            if (!pName) {
                break;
            }
            pName.children = [];
            // arr = [`<li><a href=\'/covid/list.asp?id=422\'>仙桃</a>`]
            txtSp[i + 10].split('</li>').map(str => {
                if (str.length > 10) {
                    pName.children.push(getLinkAndName(str));
                }
            });
            citys.push(pName);
        }

        return citys;
    }
    static dearWithCityData(txt) {
        let start = txt.indexOf(`$(function () { `);
        txt = txt.substring(start);
        let end = txt.indexOf(`</script>`);
        txt = txt.substring(0,end);
        let txtSps = txt.split('\n');
        txt = txtSps.slice(2,txtSps.length - 3).join('\n')
            .replace(/Highcharts.getOptions\(\).colors\[[0-9]+\]/g,'123');
        txt = `txt = {${txt}}`;
        txt = eval(txt);
        return txt;
    }

    // 下载导航
    static downloadNav() {
        return get(`http://m.sy72.com/covid19/nav.js`)
            .then(txt => {
                let citys = Utils.dearWithNav(txt);
                fs.writeFileSync(`nav.json`,JSON.stringify(citys,'','\t'),'utf-8');
                return citys;
            });
    }
    static downloadCity(link) {
        return get(`http://m.sy72.com${link}&s1=2020-10-01&s2=2022-1-30`)
        .then(txt => {
            return Utils.dearWithCityData(txt);
        });
    }
}

let provinceName = '福建';
Utils.downloadNav().then(citys => {
    let selectProvince = citys.filter(city => city.name === provinceName)[0];
    let downloading = false;
    let id = setInterval(() => {
        if (downloading) {} else {
            if (selectProvince.children.length) {
                downloading = true;
                let city = selectProvince.children.pop();
                console.log(`正在下载 ${city.name} 数据`);
                Utils.downloadCity(city.link)
                    .then(data => {
                        fs.writeFileSync(`./datas/${city.name}.json`,JSON.stringify(data,'','\t'),'utf-8');
                        downloading = false;
                    });
            } else {
                clearInterval(id);
                console.log(`下载完成`);
            }
        }
    },1000);
});


// get(`http://m.sy72.com/covid19/nav.js`)
//     .then(txt => {
//         fs.writeFileSync('nav.txt',txt,'utf-8');
//     });
//
// get(`http://m.sy72.com/covid/list.asp?id=193&s1=2020-10-01&s2=2022-1-30`)
//     .then(txt => {
//         // fs.writeFileSync(`./厦门.txt`,txt,'utf-8');
//         let start = txt.indexOf(`$(function () { `);
//         txt = txt.substring(start);
//         let end = txt.indexOf(`</script>`);
//         txt = txt.substring(0,end);
//         let txtSps = txt.split('\n');
//         txt = txtSps.slice(2,txtSps.length - 3).join('\n')
//             .replace(/Highcharts.getOptions\(\).colors\[[0-9]+\]/g,'123');
//         txt = `txt = {${txt}}`;
//         txt = eval(txt);
//         return txt;
//     }).then(d => {
//         // d 是一个 echart option 对象，这里可以直接提取数据
//         fs.writeFileSync(`厦门.json`,JSON.stringify(d,'','\t'),'utf-8');
//     });
