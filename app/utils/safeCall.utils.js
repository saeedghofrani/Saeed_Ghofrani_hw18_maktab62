const safeCallUtils = function (mainFunc, _req, _res, next) {
    return function () {
        try {
            mainFunc.apply(this, arguments);
        } catch (error) {
            next(error);
        }
    };
};
module.exports = safeCallUtils;