(function (app) {
    posjs.localize = function (defaultRes, res) {
        return function (key) {
            var value = "";
            for (var i = 0; i < res.length; i++) {
                if (res[i].key === key) {
                    value = res[i].value;
                    break;
                }
            }

            if (value == "") {
                for (var i = 0; i < defaultRes.length; i++) {
                    if (defaultRes[i].key === key) {
                        value = defaultRes[i].value;
                        break;
                    }
                }
            }

            return value !== "" ? value : key + " not found.";
        }
    };

    app.filter("localize", [
        "posjs.failbackResources",
        "posjs.resources",
        posjs.localize
    ]);
}(angular.module("posjs.app")));