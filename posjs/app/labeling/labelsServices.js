(function (app) {

    posjs.labelsServices = function ($filter, settings, productSvc, invSvc, writer) {
        this.render = function (products, selection) {
            var store = new settings();
            var html = "";

            var printedList = [];

            for (var i = 0; i < selection.length; i++) {
                for (var j = 0; j < products.length; j++) {
                    if (selection[i] == products[j]._id) {
                        for (var x = 0; x < products[j].quantityOnHand; x++) {
                            printedList.push(products[j]);
                        }
                    }
                }
            }

            var counter = 0;
            for (var i = 0; i < printedList.length; i++) {
                html += "<div class=\"label\">" +
                            "<table><tr><td colspan=\"2\"><img src=\"file://" + store.logo + "\"  /></td></tr><tr>" +
                            "<td><span class=\"code\">" + printedList[i].code + "</span></td>" +
                            "<td><span class=\"price\">" + $filter("currency")(productSvc.price(printedList[i])) + "</span></td>" +
                            "</tr></table></div>";

                counter++;
                if (counter % 30 == 0) {
                    counter = 0;
                    html += "<div class=\"page-break\"></div>";
                }
            }
            /*for (var i = 0; i < selection.length; i++) {
                if (i > 0 && i % 29 == 0) {
                    html += "<div class=\"page-break\"></div>";
                }
                for (var j = 0; j < products.length; j++) {
                    if (selection[i] == products[j]._id) {
                        html += "<div class=\"label\">" +
                            "<table><tr><td colspan=\"2\"><img src=\"file://" + store.logo + "\"  /></td></tr><tr>" +
                            "<td><span class=\"code\">" +  products[j].code + "</span></td>" +
                            "<td><span class=\"price\">" + $filter("currency")(productSvc.price(products[j])) + "</span></td>" +
                            "</tr></table></div>";
                        break;
                    }
                }
            }*/

            writer.perform(store.appPath, html);
        }
    };

    app.service("posjs.labelsServices", 
        [
            "$filter",
            "posjs.settings",
            "posjs.productService",
            "posjs.inventoryServices",
            "posjs.labelWriter",
            posjs.labelsServices
        ]);

}(angular.module("posjs.app")));