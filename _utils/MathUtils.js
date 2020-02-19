/**
 * @param num 要四舍五入的数字
 * @param n 取整到的位数，+1 表示 十位 -1 表示 0.1
 * */
const RoundToN = function (num,n) {
    num = parseFloat(num);
    n = parseInt(n);
    r = '' + Math.round(num * eval(`1E${-n}`)) * eval(`1E${n}`);
    if (-1 === r.indexOf('.')) {
        return parseInt(r);
    } else {
        if (n < 0) {
            return parseFloat(r.substring(0,r.indexOf('.') - n + 1));
        } else {
            return parseInt(r);
        }
    }
};

module.exports = {
    RoundToN
};