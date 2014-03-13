(function (app) {
    app.factory("posjs.order", function () {
        var order = function (data) {
            angular.extend(this, {
                _id: "",
                number: newInvoiceNumber(),
                email: "",
                rep: "",
                date: new Date(),
                items: [],
                discount: 0,
                paidVia: "",
                paidAmount: 0
            });
            angular.extend(this, data);
        };
        return order;
    });

    app.factory("posjs.orderCalculator", ["posjs.settings", "posjs.productService", function (settings, productSvc) {
        return {
            subTotal: function (order) {
                var t = 0;
                angular.forEach(order.items, function (item) {
                    t += parseFloat(productSvc.price(item));
                });

                return t;
            },
            discount: function (order) {
                var sub = parseFloat(this.subTotal(order));

                var d = sub * (parseFloat(order.discount) / parseFloat(100));
                return d;
            },
            realSubTotal: function (order) {
                return parseFloat(this.subTotal(order)) - parseFloat(this.discount(order));
            },
            tax1: function (order) {
                var store = new settings();
                if (store.tax1Rate > 0) {
                    var sub = this.realSubTotal(order);
                    return parseFloat(sub) * parseFloat(store.tax1Rate);
                }
                return 0;
            },
            tax2: function (order) {
                var store = new settings();
                if (store.tax2Rate > 0) {
                    var sub = this.realSubTotal(order);
                    return parseFloat(sub) * parseFloat(store.tax2Rate);
                }
                return 0;
            },
            total: function (order) {
                return parseFloat(this.realSubTotal(order)) + parseFloat(this.tax1(order)) + parseFloat(this.tax2(order));
            },
            returnAmount: function (order) {
                var total = this.total(order);
                var r = parseFloat(order.paidAmount) - parseFloat(total);
                return r;
            }
        };
    }]);

    function newInvoiceNumber() {
        var d = new Date();
        return "1-" + d.getFullYear().toString() + (parseInt(d.getMonth()) + 1).toString() + d.getDay().toString() + d.getHours().toString() + d.getMinutes() + d.getSeconds().toString();
    }

}(angular.module("posjs.app")));