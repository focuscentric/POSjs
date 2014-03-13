(function (app) {
    app.service("posjs.inventoryServices", ["$q", "posjs.inventoryDb", "posjs.product", function ($q, db, product) {
        this.all = function () {
            var deferred = $q.defer();
            db.getProducts(function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    var products = [];
                    for (var i = 0; i < data.module; i++) {
                        products.push(new product(data[i]));
                    }
                    deferred.resolve(products);
                }
            });

            return deffered.promise;
        }
    }]);
}(angular.module("posjs.app")));