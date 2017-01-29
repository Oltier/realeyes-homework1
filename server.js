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

var Datastore = require('nedb');

var exchangeRatesDB = new Datastore({filename: require('./models/exchangeRates'), inMemoryOnly: true});
var XMLPath = 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml';

var exchangeRates = [];

var callback = function(res) {
    res.on('error', function(err){
        console.log("Error while reading", err);
    });
    
    var concat = require('concat-stream');
    
    res.pipe(concat(function(buffer) {
        var data = buffer.toString();
        var filteredStr = data.slice(data.indexOf("<Cube>"), data.indexOf("</gesmes:Envelope"));
        parser.parseString(filteredStr, function(err, result) {
            if (err) {
                console.log("Error while parsing.", err);
            }
            for(var i = 0; i < result.Cube.Cube.length; i++) {
                var exchanges = [];
                for(var j = 0; j < result.Cube.Cube[i].Cube.length; j++){
                    exchanges.push(result.Cube.Cube[i].Cube[j]['$']);
                }
                
                exchangeRates.push({
                    date: result.Cube.Cube[i]['$']['time'],
                    exchangeRates: exchanges,
                })
                
                exchangeRatesDB.insert({
                    date: result.Cube.Cube[i]['$']['time'],
                    exchangeRates: exchanges,
                }, function(err, newDoc) {
                    if(err) {
                        console.log("Error inserting." + err);
                    }
                });
            }
        });
    }));
    
    /*res.on('end', function(){
        exchangeRatesDB.find({}, function(err, docs) {
            if(err) {
                console.log("Error getting entry.", err);
            }
        console.log(JSON.stringify(docs,null,2));
        });
    })*/
};

var req = http.request(XMLPath, callback).end();

var server = app.listen(port, host, function() {
    console.log('Server is started.');
});