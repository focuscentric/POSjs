/// <reference path="/lib/angular.js" />
/// <reference path="/data/inventory.js" />
/// <reference path="/models/product.js" />

(function (app) {

    posjs.InventoryCtrl = function ($scope, focus, invSvc, product, productSvc) {
        $scope.selectedProduct = null;
        $scope.editMode = false;
        $scope.price = productSvc.price;
        $scope.searchText = "";

        $scope.products = [];

        init = function () {
            var promise = invSvc.all();
            promise.then(function(products) {
                $scope.products = products;
                //$scope.$apply();
            }, function(err) {
                alert(err);
            });
        };

        $scope.create = function () {
            $scope.editMode = false;

            $scope.selectedProduct = new product();

            focus("productName");

        }

        $scope.add = function () {
            var p = $scope.selectedProduct;
            p.cost = parseFloat(p.cost);
            p.unitPrice = parseFloat(p.unitPrice);
            p.discount = parseFloat(p.discount);
            p.quantityOnHand = parseInt(p.quantityOnHand);

            var promise = invSvc.add(p);
            promise.then(function (product) {
                if (product._id) {
                    $scope.editMode = false;
                    $scope.selectedProduct = null;

                    $scope.products.push(product);
                }
            }, function (err) {
                alert(err);
            })
        };

        $scope.edit = function (product) {
            $scope.editMode = true;

            $scope.selectedProduct = product;

            focus("productName");
        };

        $scope.save = function () {
            var p = $scope.selectedProduct;
            p.cost = parseFloat(p.cost);
            p.unitPrice = parseFloat(p.unitPrice);
            p.discount = parseFloat(p.discount);
            p.quantityOnHand = parseInt(p.quantityOnHand);

            var promise = invSvc.update(p);
            promise.then(
                function () {
                    $scope.editMode = false;

                    $scope.selectedProduct = {};
                },
                function (err) {
                    alert(err);
                }
            );
        };

        $scope.remove = function () {
            var promise = invSvc.del($scope.selectedProduct._id);
            promise.then(
                function (count) {
                    var products = [];
                    for (var i = 0; i < $scope.products.length; i++) {
                        if ($scope.products[i]._id != $scope.selectedProduct._id) {
                            products.push($scope.products[i]);
                        }
                    }
                    $scope.products = products;

                    $scope.editMode = false;
                    $scope.selectedProduct = new product();
                },
                function (err) {
                    alert(err);
                }
            );
        };

        init();

    };

    app.controller("posjs.InventoryCtrl",
        [
            "$scope",
            "posjs.focus",
            "posjs.inventoryServices",
            "posjs.product",
            "posjs.productService",
            posjs.InventoryCtrl
        ]
    );
}(angular.module("posjs.app")));