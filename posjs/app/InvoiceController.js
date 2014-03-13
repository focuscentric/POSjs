(function (app) {

    posjs.InvoiceController = function ($scope, settings, orderSvc, orderCalculator, productSvc) {
        $scope.store = new settings();

        $scope.order = {};
        $scope.price = productSvc.price;
        $scope.subTotal = orderCalculator.subTotal;
        $scope.discount = orderCalculator.discount;
        $scope.realSubTotal = orderCalculator.realSubTotal;
        $scope.tax1 = orderCalculator.tax1;
        $scope.tax2 = orderCalculator.tax2;
        $scope.total = orderCalculator.total;
        $scope.returnAmount = orderCalculator.returnAmount;

        function init() {
            var orderNumber = getQS("orderId");
            var promise = orderSvc.get(orderNumber);
            promise.then(
                function (o) {
                    $scope.order = o;
                },
                function (err) {
                    alert(err);
                }
            );
        };

        function getQS(name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        init();
    };
    app.controller("posjs.InvoiceController",
        [
            "$scope",
            "posjs.settings",
            "posjs.orderServices",
            "posjs.orderCalculator",
            "posjs.productService",
            posjs.InvoiceController
        ]);
}(angular.module("posjs.app")));