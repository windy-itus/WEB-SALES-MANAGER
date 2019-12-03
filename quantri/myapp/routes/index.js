var express = require('express');
var router = express.Router();
const Account = require("../controllers/account");
const controller = new Account();
const Product = require("../controllers/product");
const controllerProduct = new Product();


router.get('/home', (req, res) => controllerProduct.ShowList(req, res));
const notice="Vui lòng nhập đúng tài khoản và mật khẩu đã đăng kí";


/* GET users listing. */
const passport=require('passport');
require('../config/passport')(passport);

router.post('/login',function(req,res,next){
 passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/login-fail' })(req,res,next);
});

router.post('/register-form', async function (req, res) {
  controller.Register(req,res);
});
router.get('/login-fail', function (req, res, next) {
  res.render('login', { title: 'Đăng nhập',notice});
});
router.get('/', function (req, res, next) {
  res.render('login', { title: 'Đăng nhập'});
});
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Đăng nhập'});
});
router.get('/logout', function (req, res, next) {
  if(req.user != null) req.user=null;
  controllerProduct.ShowList(req, res);
});



// chưa xử lí



module.exports = router;
