const ArrayToNext = function(_arr,retryTime) {
    let len = _arr.length;
    let point = 0;
    let arr = _arr;
    let pMove = {
        point: point,
        move: false,
        times: 0,
        retryTime: retryTime || 3
    };
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
        },
        // 在发生不可避免的错误时，可能需要重新进行一次，
        // 该函数，提供一个迁移接口
        preMove(cb) {
            cb = cb || (() => {});
            if (pMove.move && pMove.point === point) {
                pMove.time++;
                if (pMove.time > pMove.retryTime) {
                    cb(arr[point],pMove,function () {
                        point--;
                    });
                } else {
                    point--;
                }
            } else {
                pMove.point = point;
                pMove.time = 1;
                pMove.move = true;
                point--;
            }
        }
    }
};

module.exports = {
    ArrayToNext
};