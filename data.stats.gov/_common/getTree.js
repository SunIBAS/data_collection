const {
    post,
    defaultHeader
} = require('./../../_utils/Ajax');
const {
    ArrayToNext
} = require('./../../_utils/ObjectToNext');

const baseUrl = 'http://data.stats.gov.cn/easyquery.htm';
const params = (one) => {
    return {
        id: one.id,
        dbcode: one.dbcode,
        m: "getTree",
        wdcode: one.wdcode
    };
};

let arr;
let out = [];
let cb = () => {};
let requestOne = () => {
    arr.status();
    let curOne = arr.next();
    if (curOne) {
        post(baseUrl,{
            headers: defaultHeader
        },params(curOne))
            .then(_ => {
                return _;
            })
            .then(JSON.parse)
            .then(function (data) {
                if (typeof data === typeof []) {
                    data.forEach(o => {
                        if (o.isParent) {
                            arr.append([{
                                ...o,
                                name: curOne.name + "#" + o.name
                            }]);
                        } else {
                            out.push({
                                ...o,
                                name: curOne.name + "#" + o.name
                            });
                        }
                    });
                } else {
                    throw new Error("i don't konw");
                }
                setTimeout(function () {
                    requestOne();
                },500);
            })
            .catch(_ => {
                console.log(_);
                arr.preMove(function (v,_,pM) {
                    console.log(`retry ${_.retryTime} times fail ${JSON.stringify(v)}`);
                });
            });
    } else {
        console.log('over');
        cb(out);
        // fs.writeFileSync("treeNode.json",JSON.stringify(out),'utf-8');
    }
};


module.exports = {
    run(_cb,rootObj) {
        arr = ArrayToNext([rootObj]);
        cb = _cb;
        requestOne();
    }
};