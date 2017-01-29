var express = require("express");

var router = express.Router();

router.get('/', function(req, res){
    res.render('index');
});

router.post('/', function(req, res){
   var value = req.body.value;
   var from = req.body.fromCurrency;
   var to = req.body.toCurrency;
   console.log(req.app);
   /*req.app.exchangeRatesDB.find({date: '2017-01-27'}, function(err, docs){
       if(err) {
           console.log(err);
       }
       console.log(docs);
   });*/
});

module.exports = router;