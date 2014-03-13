module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js: {
                src: [
                    "data/inventory.js",
                    "data/orders.js",
                    "data/labelWriter.js",
                    "lib/jquery.js",
                    "bootstrap/js/bootstrap.min.js",
                    "lib/angular.js",
                    "lib/angular-route.js",
                    "lib/angular-locale_fr-ca.js",
                    "resources/default.js",
                    "resources/fr-ca.js",
                    "app/app.js",
                    "app/inventory/product.js",
                    "app/inventory/inventoryServices.js",
                    "app/inventory/InventoryCtrl.js",
                    "app/orders/order.js",
                    "app/orders/orderServices.js",
                    "app/orders/CreateOrderCtrl.js",
                    "app/orders/ManageOrderController.js",
                    "app/labeling/labelsServices.js",
                    "app/labeling/LabelsController.js",
                    "app/reports/ReportsController.js",
                    "app/settings/SettingsController.js",
                    "app/dashboard/DashboardCtrl.js",
                    "app/ui/HeaderCtrl.js",
                    "app/InvoiceController.js",
                    "app/localize.js"
                ],
                dest: 'app.js'
            }
        },
        uglify: {
            js: {
                files: {
                    'app.min.js': ['app.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat:js', 'uglify:js']);
    
    
};