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
//app.use('/', exchangeController);

var port = process.env.PORT;
var host = process.env.IP;

var xml2js = require('xml2js');

var parser = new xml2js.Parser();
parser.on('error', function(err) {
    console.log('Parser error', err);
});
var http = require('http');

var Datastore = require('nedb');

app.exchangeRatesDB = new Datastore({
    filename: './models/exchangeRates.db',
    inMemoryOnly: true
});
var XMLPath = 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml';

app.get('/', function(req, res){
    res.render('index');
});

app.post('/', function(req, res){
   var value = req.body.value;
   var from = req.body.fromCurrency;
   var to = req.body.toCurrency;
   var rate = 0;
   app.exchangeRatesDB.find({date: "2017-01-27", currency: from === "EUR" ? to : from}, function(err, docs) {
        if(err) {
            console.log("Error getting entry.", err);
        }
        
        /*if(from === "EUR") {
            var l = false;
            for(var i = 0; i < docs.exchangeRates.length && !l; i++) {
                if(docs.exchangeRates[i].currency === to) {
                    rate = docs.exchangeRates[i].rate;
                    l = true;
                }
            }
        }*/
        
        console.log(JSON.stringify(docs,null,2));
        rate = docs[0].rate;
    });
    res.json(from === "EUR" ? value * rate : value / rate);
});

var RequestPromise = require('request-promise');
RequestPromise(XMLPath)
    .then(function(data){
        
       var filteredStr = data.slice(data.indexOf("<Cube>"), data.indexOf("</gesmes:Envelope"));
       parser.parseString(filteredStr, function(err, result) {
           if (err) {
               console.log("Error while parsing.", err);
           }
           for(var i = 0; i < result.Cube.Cube.length; i++) {
               var date = result.Cube.Cube[i]['$']['time'];
               for(var j = 0; j < result.Cube.Cube[i].Cube.length; j++) {
                   var exchangeRate = result.Cube.Cube[i].Cube[j]['$'];
                   app.exchangeRatesDB.insert({
                       date: date,
                       rate: exchangeRate.rate,
                       currency: exchangeRate.currency
                   }, function(err, doc) {
                       if(err) console.log("Error inserting: " + err);
                   });
               }
           }
       });
    });

var server = app.listen(port, host, function() {
    app.models = 
    console.log('Server is started.');
});