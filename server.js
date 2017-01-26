var express = require("express");
var bodyParser = require("body-parser");
var expressValidator = require("express-validator");
var flash = require("connect-flash");

var hbs = require("hbs");
var blocks = {}
hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this));
});
hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');
    blocks[name] = [];
    return val;
})


var app = express();

app.use(express.static('public'));

app.set("views", "./views");
app.set("view engine", "hbs");


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressValidator());

app.use(flash());


var exchangeController = require("./controllers/exchange");
app.use('/', exchangeController);

var port = process.env.PORT;
var host = process.env.IP;

var xml2js = require('xml2js');

var parser = new xml2js.Parser();
parser.on('error', function(err) {
    console.log('Parser error', err);
});
var http = require('http');

var getExchangeRates = function() {
    var XMLPath = 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml';
    var rawJSON = loadXMLDoc(XMLPath);

    function loadXMLDoc(source) {
        var json;
        var data = "";
        
        http.get(source, function(res) {
            res.on('error', function(err){
                console.log("Error while reading", err);
            });
            
            res.on('data', function(XMLdata){
               data += XMLdata.toString(); 
            });
            
            res.on('end', function() {
                parser.parseString(data.substring(0, data.length), function(err, result) {
                    if (err) {
                        console.log("Error while parsing.", err);
                    }
                    json = JSON.stringify(result);
                    console.log(json);
                });
            });
        });
        
        
        console.log("File " + source + "was successfully read.\n");
        return json;
    }
}();

var server = app.listen(port, host, function() {
    console.log('Server is started.');
});
