/// <reference path="/lib/angular.js" />

posjs.app = angular.module("posjs.app", ["ngRoute"])
    .config(["$locationProvider", "$routeProvider", function ($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(false);
        $routeProvider
            .when("/products", {
                templateUrl: "partials/inventory/products.html",
                controller: "posjs.InventoryCtrl"
            }
        );
        $routeProvider
            .when('/new-order', {
                templateUrl: "partials/orders/new.html",
                controller: "posjs.CreateOrderCtrl"
            }
        );
        $routeProvider
            .when('/orders', {
                templateUrl: "partials/orders/list.html",
                controller: "posjs.ManageOrderController"
            }
        );
        $routeProvider
            .when('/labels', {
                templateUrl: "partials/labeling/index.html",
                controller: "posjs.LabelsController"
            }
        );
        $routeProvider
            .when('/reports', {
                templateUrl: "partials/reports/list.html",
                controller: "posjs.ReportsController"
            }
        );
        $routeProvider
            .when('/settings', {
                templateUrl: "partials/settings.html",
                controller: "posjs.SettingsController"
            }
        );
        $routeProvider.otherwise({
            templateUrl: "partials/dashboard.html",
            controller: "posjs.DashboardCtrl"
        });
    }]
);

posjs.app.value("posjs.inventoryDb", posjs.inventory);
posjs.app.value("posjs.ordersDb", posjs.orders);
posjs.app.value("posjs.labelWriter", posjs.labelWriter);
posjs.app.value("posjs.failbackResources", posjs.failbackResources);
posjs.app.value("posjs.resources", posjs.resources);

posjs.app.factory("posjs.settings", function () {
    var settings = function () {
        angular.extend(this, {
            loaded: false,
            logo: "",
            name: "",
            address: "",
            city: "",
            province: "",
            postalCode: "",
            phone: "",
            invoiceNotes: "",
            tax1Rate: 0,
            tax1Name: "",
            tax2Rate: 0,
            tax2Name: "",
            appPath: "",
            lockKey: ""
        });
        if(localStorage.settings)
            angular.extend(this, JSON.parse(localStorage.settings));
    };
    return settings;
});

posjs.app.directive("focusOn", function () {
    return function (scope, elem, attr) {
        scope.$on("focusOn", function (e, name) {
            if (name === attr.focusOn) {
                elem[0].focus();
            }
        });
    };
});

posjs.app.factory('posjs.focus', ["$rootScope", "$timeout", function($rootScope, $timeout) {
    return function (name) {
        $timeout(function() {
            $rootScope.$broadcast("focusOn", name);
        });
    }
}]);