(function (app) {

    posjs.LabelsController = function ($scope, invSvc, productSvc, labelSvc) {
        $scope.searchText = "";
        $scope.products = [];
        $scope.price = productSvc.price;
        $scope.selection = [];
        $scope.checkAll = false;

        function init() {
            var promise = invSvc.all();
            promise.then(
                function (products) {
                    $scope.products = products;
                },
                function (err) {
                    alert(err);
                }
            );
        };

        $scope.add = function (id) {
            $scope.selection.push(id);
        };

        $scope.del = function (id) {
            var products = [];
            for (var i = 0; i < $scope.selection.length; i++) {
                if ($scope.selection[i] != id)
                    products.push($scope.selection[i]);
            }

            $scope.selection = products;
        };

        $scope.inSelection = function (id) {
            var found = false;
            for (var i = 0; i < $scope.selection.length; i++) {
                if ($scope.selection[i] == id) {
                    found = true;
                    break;
                }
            }
            return found;
        };

        $scope.print = function () {
            var promise = invSvc.tagAsPrinted($scope.selection);
            promise.then(
                function () {
                    labelSvc.render($scope.products, $scope.selection);
                },
                function (err) {
                    alert(err);
                }
            );
        };

        $scope.checkChanged = function () {
            if ($scope.checkAll) {
                $scope.selection = [];
            } else {
                for (var i = 0; i < $scope.products.length; i++) {
                    if(!$scope.products[i].printed)
                        $scope.selection.push($scope.products[i]._id);
                }
            }

            $scope.checkAll = !$scope.checkAll;
        };

        init();
    };
    app.controller("posjs.LabelsController", 
        [
            "$scope",
            "posjs.inventoryServices",
            "posjs.productService",
            "posjs.labelsServices",
            posjs.LabelsController
        ])
}(angular.module("posjs.app")));