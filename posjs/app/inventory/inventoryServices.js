(function (app) {

    posjs.inventoryServices = function ($q, db, product) {
        this.byCode = function (code) {
            var deferred = $q.defer();
            db.getProduct(code, function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (data.length == 1) {
                        var prod = new product(data[0]);
                        deferred.resolve(prod);
                    } else {
                        deferred.reject("not a unique product.");
                    }
                }
            });

            return deferred.promise;
        },
        this.nearBO = function (qty) {
            var deferred = $q.defer();
            db.getBackOrder(qty, function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    var products = [];
                    for (var i = 0; i < data.length; i++) {
                        products.push(new product(data[i]));
                    }

                    deferred.resolve(products);
                }
            });

            return deferred.promise;
        },
        this.all = function () {
            var deferred = $q.defer();
            db.getProducts(function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    var products = [];
                    for (var i = 0; i < data.length; i++) {
                        products.push(new product(data[i]));
                    }

                    products.sort(function (a, b) {
                        return a.code.toLowerCase() < b.code.toLowerCase() ? -1 :
                                a.code.toLowerCase() > b.code.toLowerCase() ? 1 : 0;
                    });
                    
                    deferred.resolve(products);
                }
            });

            return deferred.promise;
        },
        this.add = function (newProduct) {
            var deferred = $q.defer();
            db.addProduct(newProduct, function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    var prod = new product(data);
                    deferred.resolve(prod);
                }
            });
            return deferred.promise;
        },
        this.update = function (updatedProduct) {
            var deferred = $q.defer();
            db.updateProduct(updatedProduct, function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (data > 0)
                        deferred.resolve();
                    else
                        deferred.reject("Unable to find the product.");
                }
            });
            return deferred.promise;
        },
        this.decInventory = function (ids) {
            var deferred = $q.defer();
            db.decreaseInventory(ids, function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (data > 0)
                        deferred.resolve();
                    else
                        deferred.reject("Inventory could not be decreased.");
                }
            });
            return deferred.promise;
        },
        this.tagAsPrinted = function (ids) {
            var deferred = $q.defer();
            db.flagAsPrint(ids, function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (data > 0)
                        deferred.resolve();
                }
            });
            return deferred.promise;
        }
        this.del = function (id) {
            var deferred = $q.defer();
            db.removeProduct(id, function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(data);
                }
            });
            return deferred.promise;
        }
    };

    app.service("posjs.inventoryServices",
        [
            "$q",
            "posjs.inventoryDb",
            "posjs.product",
            posjs.inventoryServices
        ]);
}(angular.module("posjs.app")));