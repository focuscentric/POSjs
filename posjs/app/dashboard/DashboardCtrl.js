/// <reference path="/lib/angular.js" />

(function (app) {

    posjs.DashboardCtrl = function ($scope, settings) {
        $scope.store = new settings();

        function init() {
            if (!$scope.store.loaded)
                location.href = "#/settings";
        };

        init();
    };

    app.controller("posjs.DashboardCtrl", ["$scope", "posjs.settings", posjs.DashboardCtrl]);
}(angular.module("posjs.app")));