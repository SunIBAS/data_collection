const ArrayToNext = function(_arr) {
    let len = _arr.length;
    let point = 0;
    let arr = _arr;
    return {
        next() {
            if (point === len) {
                return false;
            } else {
                return arr[point++];
            }
        },
        reset() {
            point = 0;
        },
        resetArray(_arr) {
            arr = _arr;
            len = arr.length;
            point = 0;
        }
    }
};

module.exports = {
    ArrayToNext
};