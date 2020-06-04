let fs = require('fs');
let url = "https://ibsbjstar.ccb.com.cn/CCBIS/B2CMainPlat_07_MB?SEC_VERSION=4.1.6&VERSION_NAME=3.0.0.0&MP_CODE=01&GLOBAL_SKEY=&ccbParam=HfW7ymPV%2Fat0jaNm76QtYbBFIHmVsXbmf69PyekPK0bsP4Y9DskXW6S0q63F%2FciUZpc6w4X2DvNe7VSXBb7qsBRbWFS7noJpC2Pj9Zim2gp4qctKLCAueFnXwncCP%2FObZ9cRRoD%2ByJhxkSroTEVmTc%2BX%2FHqtmgxhntjZSbGz4UKpTIRZJMfWMBDBc2HsYDxcsuNdgEB3K%2BgwipLmT%2FiaZ96IQXTNmjHFx8W7fQ6%2BItBdmT1gX113a%2Bo4p1TyEuue29dU69Fw6Hgg%2BY8b8mnZayYtbd59FDkFYvRmUits76V3bGja92ebbMCO0iEl%2FMF%2FGkMDiY%2BC8uYU%2Bp1S1dN8r6LKnG6vrwRZML015%2BLQHgxzPVg1F5cT4a6hy4yRR2%2FmDD9emECCYyf6V%2Fe5MCOV9FlFLqFsMbFouBWDGhq9h8YNUHiutH2hhV8dlYWO8xWP0Yfyc8Mtdoa7nZ5zafc6nHm0Gy27V5HsE%2FYA2RxF%2B1%2BdT6ThZWaKskDHJH19Fs0Afl8%2FOr7JOycdKCQtOMiB4K3Csr0E3kmgr6Mq1%2Bj9jKbHykNcTcSoahqwK%2FSaXFH6cYNamicGpkVkU84zfQPukvXZ9wbjDzfttR9F6o%2FrGlH3Pr1iyoikjZvoYMZDagzIiVve117vYgq8BJYl%2Bh28vKWFd%2BMidXSW9M5lkkrFVfHbbKOgn5z4KRsIWoMShF2Z3Lx5bz6HGW%2FORuP6IyjYcrvUYCM2XKByARF0xvcATTZwDaE1JZUehbBI7%2Bsm3oydS8duE5sIq3gNV6NvAx2fpxR0V%2FRkkw0hcN7TITwWZGs%3D&SYS_CODE=0760&APP_NAME=com.chinamworld.main&SKEY=";
const https = require("https");
const http = require('http');

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
            resp.on('data',(chunk) => data += chunk);
            resp.on('end',() => {
                scb(data);
            });
            resp.on("error",fcb);
        });
    })
};

get(url)
    .then(_ => {
        fs.writeFileSync('./data/' + (new Date()).getTime() + '.json',_,'utf-8');
    });