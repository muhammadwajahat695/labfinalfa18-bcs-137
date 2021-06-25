var express = require('express');
const auth = require('../middewares/auth');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/ground', function(req, res, next) {
  let ground= req.cookies.ground;
  if (!ground) ground=[];

  res.render('ground',{ground});
});


module.exports = router;
