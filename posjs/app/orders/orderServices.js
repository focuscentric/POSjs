(function (app) {

    posjs.orderServices = function ($q, db, order) {
        this.get = function (number) {
            var deferred = $q.defer();
            db.getOrder(number, function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (data.length == 1) {
                        var o = new order(data[0]);
                        deferred.resolve(o);
                    } else {
                        deferred.reject("No a unique order number.");
                    }
                }
            });

            return deferred.promise;
        },
        this.all = function () {
            var deferred = $q.defer();
            db.getOrders(function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    var orders = [];
                    for (var i = 0; i < data.length; i++) {
                        orders.push(new order(data[i]));
                    }

                    orders.sort(function (a, b) {
                        a = new Date(a.date);
                        b = new Date(b.date);
                        return a > b ? -1 : a < b ? 1 : 0;
                    });
                    
                    deferred.resolve(orders);
                }
            });

            return deferred.promise;
        },
        this.create = function (o) {
            var deferred = $q.defer();
            db.addOrder(o, function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(new order(data));
                }
            });
            return deferred.promise;
        },
        this.del = function (id) {
            var deferred = $q.defer();
            db.removeOrder(id, function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(data);
                }
            });
            return deferred.promise;
        }
    };

    app.service("posjs.orderServices",
        [
            "$q",
            "posjs.ordersDb",
            "posjs.order",
            posjs.orderServices
        ]);
}(angular.module("posjs.app")));