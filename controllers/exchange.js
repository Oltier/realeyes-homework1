var express = require("express");

var router = express.Router();

router.get('/', function(req, res){
    req.app.exchangeRatesDB.find({}, {_id: 0, rate: 0}).sort({date: -1, currency: 1}).limit(31).exec(function(err, docs){
        if(err) throw err;
        console.log(docs);
        res.render('index', {
            docs: docs
        });
        
        
    });
});

router.post('/', function(req, res){
   var value = parseFloat(req.body.value);
   var from = req.body.fromCurrency;
   var to = req.body.toCurrency;
    
    if(value < 0) {
        res.status(400).send('Please enter a positive number.');
        return;
    }
    
    if(from === to) {
        res.json({"value": value});
    } else if (from === "EUR" || to === "EUR"){
       req.app.exchangeRatesDB.find({currency: from === "EUR" ? to : from}).sort({date: -1}).limit(1).exec(function(err, docs){
           if(err) console.log("Error getting entry.", err);
           if(typeof docs === 'undefined' || docs.length <= 0){
               res.status(400).send('Please select a valid currency from the list.');
               return;
           }
           var rate = parseFloat(docs[0].rate);
           res.json(from === "EUR" ? {"date": docs[0].date, "value": (value * rate)} : {"date": docs[0].date, "value": (value / rate)});
       });
   } else {
       req.app.exchangeRatesDB.find({currency: {$in: [from, to]}}).sort({date: -1}).limit(2).exec(function(err, docs) {
           if(err) console.log("Error getting entry.", err);
           if(typeof docs === 'undefined' || docs.length <= 0 || docs[0].currency === docs[1].currency) {
               res.status(400).send('Please select a valid currency from the list.');
               return;
           }
           docs[0].currency === from 
           ? res.json({"date": docs[0].date, "value": (value / parseFloat(docs[0].rate)) * docs[1].rate}) 
           : res.json({"date": docs[0].date, "value": (value / parseFloat(docs[1].rate)) * docs[0].rate});
       })
   }
    
});

router.get('/history', function(req, res){
    req.app.exchangeRatesDB.find({}, {_id: 0}).sort({date: -1, currency: 1}).limit(31).exec(function(err, docs){
        if(err) throw err;
        res.render('history', {
            docs: docs
        });
    });
});

router.get('/history/getdata', function(req, res){
    req.app.exchangeRatesDB.find({}, {_id: 0}).sort({currency: -1, date: 1}).exec(function(err, docs){
        if(err) throw err;
        res.json(docs);
    });
});

module.exports = router;