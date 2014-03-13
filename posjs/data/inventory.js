posjs.inventory = function () {
    var path = require('path'),
        datastore = require('nedb'),
        db = new datastore({ filename: getDatabasePath(), autoload: true }),
        total = 0,
        c = 0,
        deferCallback = null;

    function getDatabasePath() {
        return path.join(
            process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
            'posjs',
            'inventory.db');
    }

    getProduct = function (code, callback) {
        db.find({ code: code }, function (err, data) {
            callback(err, data);
        });
    };

    getBackOrder = function (qty, callback) {
        //db.find({}, function (err, data) {
        qty = parseInt(qty);
        db.find({ "quantityOnHand": { $lte: qty } }, function (err, data) {
            /*var matches = [];
            for (var i = 0; i < data.length; i++) {
                if (parseInt(data[i].quantityOnHand) <= qty)
                    matches.push(data[i]);
            }*/
            console.log("db found " + data.length + " item with " + qty + " or lower on hand.");
            callback(err, data);
        });
    };

    getProducts = function (callback) {
        db.find({}, function (err, data) {
            callback(err, data);
        });
    };

    addProduct = function (product, callback) {
        db.insert(product, function (err, inserted) {
            if (callback && typeof (callback) === 'function') {
                callback(err, inserted);
            }
        });
    };

    updateProduct = function (product, callback) {
        db.update({ _id: product._id }, 
            {
                code: product.code,
                name: product.name,
                cost: product.cost,
                unitPrice: product.unitPrice,
                discount: product.discount,
                quantityOnHand: product.quantityOnHand,
                mnfCode: product.mnfCode,
                added: product.added,
                printed: product.printed
            }, {}, function (err, numReplaced) {
            callback(err, numReplaced);
        });
    };

    decreaseInventory = function (ids, callback) {
        c = 0;
        total = ids.length;
        deferCallback = callback;

        for (var i = 0; i < total; i++) {
            db.update({ _id: ids[i] }, { $inc: { quantityOnHand: -1 } }, {}, function (err, numUpdated) {
                decreaseCallback(numUpdated);
            });
        }
        /*
        db.update({ _id: { $in: ids } }, { $inc: { quantityOnHand: -1 } }, {}, function (err, numUpdated) {
            callback(err, numUpdated);
        });
        */
    };

    decreaseCallback = function (updated) {
        c += updated;
        if (c == total)
            deferCallback(null, c);
    };

    flagAsPrint = function (ids, callback) {
        c = 0;
        total = ids.length;

        deferCallback = callback;

        for (var i = 0; i < total; i++) {
            db.update({ _id: ids[i] }, { $set: { printed: true } }, {}, function (err, numUpdated) {
                printed(numUpdated);
            });
        }
    };

    printed = function (update) {
        c += update;
        if (c == total) {
            deferCallback(null, c);
        }
    };

    removeProduct = function(id, callback) {
        db.remove({ _id: id }, {}, function(err, removedCount) {
            if(callback && typeof(callback) === "function") {
                callback(err, removedCount);
            }
        });
    };

    return {
        getProduct: getProduct,
        getBackOrder: getBackOrder,
        getProducts: getProducts,
        addProduct: addProduct,
        updateProduct: updateProduct,
        removeProduct: removeProduct,
        decreaseInventory: decreaseInventory,
        flagAsPrint: flagAsPrint
    }
}();