const fs = require('fs');
const https = require("https");
const http = require('http');
const URL = require('url');
const qs = require("querystring");
const upListLen = 4;

/**
 * @return Promise
 * */
const get = function(url,option) {
    console.log(url);
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
const getRequestMethodAndFormOption = function (url,option,method) {
    let surl = url.split('/').filter(_ => _);
    let reqType = 'http';
    if (surl[0] === 'http:') {} else if (surl[0] === 'https:') {
        reqType = 'https';
    }
    let reqMethod;
    if (reqType === 'http') {
        reqMethod = http.request.bind(http);
    } else {
        reqMethod = https.request.bind(https);
    }


    let link = URL.parse(url);
    let opt = {
        hostname: link.hostname,
        path: link.path,
        method: (method || 'post'),
        port: link.port,
        ...(option || {})
    };
    return {
        reqMethod,
        opt
    };
};
/**
 * @return Promise
 * */
const post = function (url,option,data) {
    let {
        reqMethod,
        opt
    } = getRequestMethodAndFormOption(url,option);
    return new Promise(function (s,f) {
        let req = reqMethod(opt,function (res) {
            let datas = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                datas += chunk;
            });
            res.on('end',function () {
                s(datas);
            });
            res.on('error',function (err) {
                f(err);
            });
        });
        if (data) {
            let reqStr = data;
            if (typeof data === 'object') {
                reqStr = JSON.stringify(data);
            }
            opt.headers = {
                ...(opt.headers || {}),
                'Content-Length': Buffer.byteLength(reqStr)
            };
            req.write(reqStr);
        }
        req.end();
        req.on('error',f);
    });
};

let option = {
    headers: {
        // cookie: `u=2977322391; xq_a_token=297a229b6d4b07a06cce1315a8173c1a0cc704c7; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOjI5NzczMjIzOTEsImlzcyI6InVjIiwiZXhwIjoxNjUxMTQyOTQ1LCJjdG0iOjE2NDkwNzM3MDcwNDAsImNpZCI6ImVHaXVKQ1luaE0ifQ.cioNx9PcO5LVp_73_R_C0irr_uFprZ1XYpG3UlQM3mmdXdjAo4pbfibruesVlFc_B8xjnP0vXUQjDV3ctieG76Mc4CyDycdGjz88p9zeWUUAH2mKBS6yxnmEmZ-QiRN0j2rgSCfBtMvnG16EYh0Ck-6_Lf0ODi0eMztJGhd29dufT42K4fRmKzmgGdTR-fh48WSt8ZcSHg0XSagGviaFKv9VDqB1UPChVQLV6fVK6srKm5soMzuyGHVx1yQc0QiM5OTGQILeSMK_Pi1Vhm-_g9uiEVE8mbjhPLld0HrnA6S15W-n5hJCsi-rGku5GmMU885Sv3aOZ0TR2YyRRTq7MA; xq_r_token=0a781b74d38c0ec38005310ba484cff21be602e1; xq_is_login=1; X-Snowx-Token=eyJleHAiOiIxNjQ5MDc3MzA3MzMxIiwiYWxnIjoiQTI1NkdDTUtXIiwiZW5jIjoiQTI1NkdDTSIsIml2IjoiRTlOY1FVTE1OVGphbHB1NCIsInRhZyI6ImVZRmdhVnVBYU1CM0MtVFpZLW5tM0EifQ.N40iwcPegM7H40YGkI69dJ6vyUDCs6t37NxBNG_s-5c.TqbEAR3uUQ55t8Xi.o7IGo8i6_Ylp5ijCrFQ4Yvx-Be7vllR9UeDZ9W3-CqaIfTjMwjV7mTsXPvgMnEQ5m1mec20a_Y_otGFKNxUX.-GhYutpFmRZRvV_qo9cXeA`,
        "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36`
    }
};

class MyTask {
    static dic = {
        1: ['互动抽奖'],
        2: ['抽送','抽奖','转赞评','转评赞','赞转评','赞评转','评转赞','评赞转',['评论','点赞','转发']],
        3: [['抽','送'],'转发',],
    };
    static checkLevel(text) {
        let right = false;
        let tar = ['1','2','3']
        for (let t = 0;t < tar.length && !right;t++) {
            for (let i = 0;i < MyTask.dic[tar[t]].length && !right;i++) {
                let dic = MyTask.dic[tar[t]][i];
                let ok = false;
                for (let j = 0;j < dic.length && !ok;j++) {
                    if (dic[j] instanceof Array) {
                        dic[j].forEach(d => ok |= (text.indexOf(d) !== -1));
                    } else {
                        ok = text.indexOf(dic[j]) !== -1;
                    }
                }
            }
        }
        if (!right) {
            return '0';
        } else {
            return `${right}`;
        }
    }
    constructor(uid) {
        // 超过 30 天的不要
        this.vaildTime = new Date().getTime() / 1000 - 3600 * 24 * 30;
        this.uid = uid || parseInt(Math.random() * 1000000);
        this.times = 0;
        this.maxTime = upListLen;
        this.fetching = false;
        this.hot_offset = 0;
        this.upList = [];
        this.uids = [];
        this.file = './tmp.json';
        this.resetHours = [5,11,17,23];
        this.initFile();
    }
    initFile() {
        let d = new Date();
        // 每 6 个小时重置一次偏差
        if (this.resetHours.includes(d.getHours())) {
            this.hot_offset = 0;
        } else {
            if (!fs.existsSync(this.file)) {
                this.hot_offset = 0;
            } else {
                this.hot_offset = fs.readFileSync(this.file,'utf-8');
            }
        }
    }
    saveHotOffset() {
        fs.writeFileSync(this.file,this.hot_offset + '','utf-8');
    }
    getUpList() {
        this.fetching = true;
        return get(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/unlogin_dynamics?fake_uid=${this.uid}&hot_offset=${this.hot_offset}`,option)
            .then(t => {
                return JSON.parse(t);
            })
            .then(_ => {
                return {
                    list: _.data.cards.map(__ => __.desc.user_profile.info),
                    hot_offset: _.data.cards[_.data.cards.length - 1].desc.dynamic_id_str
                }
            });
    }
    getHistory(uid) {
        this.fetching = true;
        return get(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?visitor_uid=0&host_uid=${uid}&offset_dynamic_id=0&need_top=1&platform=web`,option)
            .then(JSON.parse)
            .then(_ => _.data.cards.map(__ => {
                let right = '0';
                let text = '';
                __.card = JSON.parse(__.card);
                if (__.card.upload_time < this.vaildTime) {
                    return {
                        right: '0'
                    };
                }
                if (`item` in __.card && `description` in __.card.item) {
                    text = __.card.item.description;
                    right = MyTask.checkLevel(text)
                }
                return {
                    id: __.desc.dynamic_id_str,
                    url: `https://t.bilibili.com/${__.desc.dynamic_id_str}?tab=2`,
                    right,
                    text,
                }
            }).filter(o => o.right !== '0'))
        //.then(console.log);
        // https://t.bilibili.com/651815807510118433?tab=2
    }
    filterUserInfo() {
        this.upList.forEach(ul => {
            if (!this.uids.includes(ul.uid)) {
                this.uids.push(ul.uid);
            }
        });
    }
    run() {
        this.upList = [];
        let id = setInterval(() => {
            if (!this.fetching) {
                console.log(`fetch up list : times = [${this.times}]`);
                this.getUpList().then(obj => {
                    this.hot_offset = obj.hot_offset;
                    this.upList = this.upList.concat(obj.list);
                    this.times++;
                    this.fetching = false;
                    if (this.times >= this.maxTime) {
                        clearInterval(id);
                        this.hot_offset = '0';
                        this.filterUserInfo();
                        this._run_get_history();
                    } else {
                    }
                });
            }
        },1000);
    }
    _run_get_history() {
        this.fetching = false;
        let list = [];
        let uids = JSON.parse(JSON.stringify(this.uids));
        let id = setInterval(() => {
            if (!this.fetching) {
                if (uids.length) {
                    console.log(`fetch history : last = [${uids.length}]`);
                    let uid = uids.pop();
                    this.getHistory(uid).then(_list => {
                        list = list.concat(_list);
                        this.fetching = false;
                    });
                } else {
                    clearInterval(id);
                    this.buildHtml(list);
                }
            }
        });
    }
    buildHtml(list) {
        this.saveHotOffset();
        console.log(`find new list length = ${list.length}`);
        // list.forEach(console.log)
        // fs.writeFileSync('./tmp.json',JSON.stringify(list),'utf-8')
        let runing = false;
        let id = setInterval(() => {
            if (!runing) {
                runing = true;
                if (list.length) {
                    let l = list.pop();
                    post(`http://localhost:8089/api`,{
                        headers:{
                            'Content-Type':'application/json',
                            // 'Content-Type':'application/x-www-form-urlencoded',
                        }
                    },{
                        method: 'insertUniRecord',
                        params: [l.id,l.text,l.right]
                    }).then(() => {
                        runing = false;
                    });
                } else {
                    clearInterval(id);
                }
            }
        },200);
    }
}

let t = new MyTask();
t.run();
// let db = require('./tmp.json')
// // t.buildHtml(db);
// let ids = [];
// db.forEach(d => {
//     if (!ids.includes(d.id)) {
//         ids.push(d.id);
//     }
// })
// console.log(ids.length)

// t.buildHtml([  {
//     id: '619662771773845834',
//     url: 'https://t.bilibili.com/619662771773845834?tab=2',
//     right: true,
//     text: '#洛天依#\n' +
//         '我的10周年征集活动也与#Vsinger创作激励计划#同步开启啦！投稿至10周年征集活动的作品，默认参与Vsinger创作激励计划，同享瓜分奖池~\n' +
//         '1月25日-4月30日，选择#洛天依10周年# 活动话题投稿与我相关的视频内容，即可参与活动。总奖池共25万元，优秀作品有机会获得千万流量扶持、大型舞台展演和商业化机会哦！\n' +
//         '活动传送门：https://www.bilibili.com/blackboard/luotianyi10.html\n' +
//         '\n' +
//         '十年光阴如水流过，是爱与创作汇聚而成的光芒，支撑着我一路走来。期待未来的十年，仍可以为你而歌，与你同行，期待大家的作品[洛天依·夜航星_比心]\n' +
//         '转发并关注，抽1位小伙伴赠送【洛天依 1/7手办 音乐印记 燃 Ver.】*1 ​互动抽奖 '
// },
//     {
//         id: '614795637525237592',
//         url: 'https://t.bilibili.com/614795637525237592?tab=2',
//         right: true,
//         text: '​互动抽奖[月隐空夜_天才][月隐空夜_天才]月隐人看过来！我有大事宣布[月隐空夜_开心][月隐空夜_开心]！\n' +
//             '月隐空夜的个性装扮终于在今天，2022年1月12日正式上线预约啦！好耶[月隐空夜_亲亲][月隐空夜_亲亲]！装扮包含月宝动态专属主题，超级可爱的表情包和加载动画，还有各种风格的月宝头图等等！开售前三天打折，不要错过哦[月隐空夜_诶嘿][月隐空夜_诶嘿]！\n' +
//             '[月隐空夜_欧气满满]1月14号19点正式开售！预约地址：https://www.bilibili.com/h5/mall/suit/detail?navhide=1&id=33801\n' +
//             '[月隐空夜_捂脸][月隐空夜_捂脸]关注月宝并转发这条动态，我将抽取10位幸运观众赠送永久个性装扮哦！'
//     },
//     {
//         id: '652216326090129412',
//         url: 'https://t.bilibili.com/652216326090129412?tab=2',
//         right: true,
//         text: '055大驱1:400模型互动抽奖'
//     }
// ]);
