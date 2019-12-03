var express = require('express');
var router = express.Router();
const Account = require("../controllers/account");
const controller = new Account();
router.use(express.static("public"));

/* GET users listing. */
const passport=require('passport');
require('../config/passport')(passport);

router.post('/login',function(req,res,next){
 passport.authenticate('local', { successRedirect: '/products', failureRedirect: '/login' })(req,res,next);
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Đăng nhập/Đăng ký' });
});
router.post('/login/register-form', async function (req, res) {
  controller.Register(req,res);
});
module.exports = router;
