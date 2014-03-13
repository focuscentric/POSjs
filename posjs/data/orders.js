posjs.orders = function () {
    var path = require('path'),
        datastore = require('nedb'),
        db = new datastore({ filename: getDatabasePath(), autoload: true });

    function getDatabasePath() {
        return path.join(
            process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
            'posjs',
            'orders.db');
    }

    getOrder = function (number, callback) {
        db.find({ number: number }, function (err, data) {
            callback(err, data);
        });
    };

    getOrders = function (callback) {
        db.find({}, function (err, data) {
            callback(err, data);
        });
    };

    addOrder = function (order, callback) {
        db.insert(order, function (err, inserted) {
            if (callback && typeof (callback) === 'function') {
                callback(err, inserted);
            }
        });
    };

    removeOrder = function (id, callback) {
        db.remove({ _id: id }, {}, function (err, removeCount) {
            if (callback && typeof (callback) === "function") {
                callback(err, removeCount);
            }
        });
    };

    return {
        addOrder: addOrder,
        getOrder: getOrder,
        getOrders: getOrders,
        removeOrder: removeOrder
    }
}();