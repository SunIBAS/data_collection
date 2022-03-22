const {
    datas
} = require('./datas');

// "conclusion": {
//     "日期": "3月16日",
//         "新增本土确诊": "71",
//         "新增本土无症状": "20",
//         "新增境外输入确诊": "12",
//         "新增境外输入无症状": "19"
// },

console.log(['日期','本土确诊','本土无症状','境外确诊','境外无症状'].join('\t'))
let sort = (a,b) => {
    return b.t - a.t;
}
let map = a => {
    let aym = a.conclusion.日期.match(/[0-9]+/g);
    return {
        ...a,
        t: (+aym[0]) * 100 + (+aym[1])
    }
}
datas.map(map).sort(sort).slice(1).forEach(d => {
    console.log([
        d.conclusion.日期,
        d.conclusion.新增本土确诊,
        d.conclusion.新增本土无症状,
        d.conclusion.新增境外输入确诊,
        d.conclusion.新增境外输入无症状,
    ].join('\t\t'));
})
