/// <reference path="/lib/angular.js" />
/// <reference path="/data/inventory.js" />
/// <reference path="/models/product.js" />

(function (app) {

    posjs.CreateOrderCtrl = function ($scope, focus, invSvc, product, orderSvc, orderCalculator, order, productSvc) {
        $scope.code = "";
        $scope.order = new order();
        $scope.price = productSvc.price;
        $scope.subTotal = orderCalculator.subTotal;
        $scope.discount = orderCalculator.discount;
        $scope.realSubTotal = orderCalculator.realSubTotal;
        $scope.tax1 = orderCalculator.tax1;
        $scope.tax2 = orderCalculator.tax2;
        $scope.total = orderCalculator.total;
        $scope.returnAmount = orderCalculator.returnAmount;

        $scope.addProduct = function () {
            var promise = invSvc.byCode($scope.code);
            promise.then(
                function (product) {
                    $scope.order.items.push(product);

                    $scope.code = "";
                },
                function (err) {
                    alert(err);
                }
            );
        };

        $scope.remove = function (toDelete) {
            var items = [];
            angular.forEach($scope.order.items, function (item) {
                if (item.code != toDelete.code)
                    items.push(item);
            });

            $scope.order.items = items;
        };

        $scope.confirmAndPrint = function () {
            var o = $scope.order;
            var ids = [];
            // remove angular's prop starting with $ since nedb does not allow them.
            for (var i = 0; i < o.items.length; i++) {
                ids.push(o.items[i]._id);

                for (var p in o.items[i]) {
                    if (p.indexOf("$") == 0)
                        delete o.items[i][p];
                }
            }

            var decPromise = invSvc.decInventory(ids);
            decPromise.then(
                function () {
                    var promise = orderSvc.create(o);
                    promise.then(
                        function () {
                            location.href = "invoice.html?orderId=" + o.number;
                        },
                        function (err) {
                            alert(err);
                        }
                    );
                },
                function (err) {
                    alert(err);
                }
            );
        };
    };

    app.controller("posjs.CreateOrderCtrl", [
        "$scope",
        "posjs.focus",
        "posjs.inventoryServices",
        "posjs.product",
        "posjs.orderServices",
        "posjs.orderCalculator",
        "posjs.order",
        "posjs.productService",
        posjs.CreateOrderCtrl
    ]);

}(angular.module("posjs.app")));