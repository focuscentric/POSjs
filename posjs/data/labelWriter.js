posjs.labelWriter = function () {
    var path = require("path"),
        fs = require("fs"),
        open = require("open");

    function perform(dir, html) {
        var template = fs.readFileSync(path.join(dir, "labels.html")).toString();

        template = template.replace("[items]", html);

        fs.writeFileSync(path.join(dir, "labels-printer.html"), template);
        
        open(path.join(dir, "labels-printer.html"));
    };    

    return {
        perform: perform
    };

}();