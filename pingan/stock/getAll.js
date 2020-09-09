const {
    get
} = require('./../../_utils/Ajax');
const fs = require('fs');

// http://quote.eastmoney.com/center/gridlist.html#staq_net_board
let obj = {
    沪深A:(page) => {
        return `http://88.push2.eastmoney.com/api/qt/clist/get?pn=${page}&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:0+t:6,m:0+t:13,m:0+t:80,m:1+t:2,m:1+t:23&fields=f12,f14`
    },
    上证A:(page) => {
        return `http://88.push2.eastmoney.com/api/qt/clist/get?pn=${page}&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:1+t:2,m:1+t:23&fields=f12,f14`
    },
    深证A:(page) => {
        return `http://88.push2.eastmoney.com/api/qt/clist/get?pn=${page}&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:0+t:6,m:0+t:13,m:0+t:80&fields=f12,f14`
    },
    新股:(page) => {
        return `http://88.push2.eastmoney.com/api/qt/clist/get?&pn=${page}&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f26&fs=m:0+f:8,m:1+f:8&fields=f12,f14`
    },
    中小板:(page) => {
        return `http://88.push2.eastmoney.com/api/qt/clist/get?pn=${page}&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:0+t:13&fields=f12,f14`
    },
    创业板:(page) => {
        return `http://88.push2.eastmoney.com/api/qt/clist/get?pn=${page}&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:0+t:80&fields=f12,f14`
    },
    科创板:(page) => {
        return `http://88.push2.eastmoney.com/api/qt/clist/get?pn=${page}&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:1+t:23&fields=f12,f14`
    },
    沪股通:(page) => {
        return `http://88.push2.eastmoney.com/api/qt/clist/get?pn=${page}&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f26&fs=b:BK0707&fields=f12,f14`
    },
    B股:(page) => {
        return `http://88.push2.eastmoney.com/api/qt/clist/get?pn=${page}&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:0+t:7,m:1+t:3&fields=f12,f14`
    },
    上证AB股比价:(page) => {
        return `http://88.push2.eastmoney.com/api/qt/clist/get?pn=${page}&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f199&fs=m:1+b:BK0498&fields=f12,f14`
    },
    深证AB股比价:(page) => {
        return `http://88.push2.eastmoney.com/api/qt/clist/get?pn=${page}&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f199&fs=m:0+b:BK0498&fields=f12,f14`
    },
    风险警示板:(page) => {
        return `http://88.push2.eastmoney.com/api/qt/clist/get?pn=${page}&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:0+f:4,m:1+f:4&fields=f12,f14`
    },
    两网及退市:(page) => {
        return `http://88.push2.eastmoney.com/api/qt/clist/get?pn=${page}&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:0+s:3&fields=f12,f14`
    }
}

let fromPage = 1;
let names = [];
let nameLength = 0;
let nameFrom = -1;
for (let i in obj) {
    names.push(i);
    nameLength++;
}
let all = [];
let getAll = () => {
    if (all.length) {
        fs.writeFileSync(`./datas/${names[nameFrom]}.json`,JSON.stringify(all),'utf-8');
    }
    fromPage = 0;
    nameFrom++;
    if (nameFrom === nameLength) {
        // over
        mergeThem();
    } else {
        setTimeout(function () {
            getOne(names[nameFrom]);
        },120);
    }
}

let getOne = (tar) => {
    fromPage++;
    get(obj[tar](fromPage))
        .then(JSON.parse)
        .then(_ => _.data)
        .then(_ => {
            if (_) {
                _ = _.diff;
                all = all.concat(_);
                setTimeout(function () {
                    getOne(tar);
                })
            } else {
                getAll();
            }
        })
};

const mergeThem = () => {
    let names = ['沪深A','上证A','深证A','新股','中小板','创业板','科创板','沪股通','B股','上证AB股比价','深证AB股比价','风险警示板','两网及退市'];

    let all = [];
    names.forEach((n,ind) => {
        all.push({
            name: n,
            index: ind,
            datas: require(`./datas/${n}.json`)
        });
    });

    fs.writeFileSync('./datas/all.json',JSON.stringify(all),'utf-8');
};
getAll();

// get(obj.两网及退市(1))
//     .then(console.log)