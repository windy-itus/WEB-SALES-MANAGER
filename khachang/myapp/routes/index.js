var express = require('express');
var router = express.Router();
const Account = require("../controllers/account");
const controller = new Account();
const Product = require("../controllers/product");
<<<<<<< HEAD
const controllerProduct = new Product();


router.get('/home', (req, res) => controllerProduct.ShowList(req, res));
const notice="Vui lòng nhập đúng tài khoản và mật khẩu đã đăng kí";


/* GET users listing. */
const passport=require('passport');
require('../config/passport')(passport);

router.post('/login',function(req,res,next){
 passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/login/login-fail' })(req,res,next);
});

router.post('/login/register-form', async function (req, res) {
  controller.Register(req,res);
});
router.get('/login/login-fail', function (req, res, next) {
  console.log(notice);
  res.render('login', { title: 'Đăng nhập',notice});
});
router.get('/', function (req, res, next) {
  res.render('login', { title: 'Đăng nhập'});
});



// chưa xử lí
router.get('/about', function (req, res, next) {
  res.render('about', { title: 'Về Chúng Tôi' });
=======
const Account = require("../controllers/account");
const accController = new Account();
const controller = new Product();
const passport = require('passport');
router.use(express.static("public"));
require('../config/passport')(passport);


router.get('/', (req, res) => controller.ShowList(req, res));

router.post('/login', function (req, res, next) {
  passport.authenticate('local', { successRedirect: '/products', failureRedirect: '/login' })(req, res, next);
>>>>>>> 0739f1f71c1cd5904d650dfc53b6f3aba404122c
});

router.get('/login', function (req, res, next) {
<<<<<<< HEAD
  res.render('login', { title: 'Đăng nhập'});
=======
  res.render('login', { title: 'Đăng nhập/Đăng ký' });
});
router.post('/login/register-form', async function (req, res) {
  accController.Register(req, res);
});

router.get('/about', function (req, res, next) {
  var user = "";
  if (req.user != undefined && req.user != null) {
    user = req.user._doc.name;
  }
  res.render('about', { title: 'Về Chúng Tôi', user: user });
>>>>>>> 0739f1f71c1cd5904d650dfc53b6f3aba404122c
});

router.get('/contact', function (req, res, next) {
  var user = "";
  if (req.user != undefined && req.user != null) {
    user = req.user._doc.name;
  }
  res.render('contact', { title: 'Liên hệ', user: user });
});

router.get('/faq', function (req, res, next) {
  var user = "";
  if (req.user != undefined && req.user != null) {
    user = req.user._doc.name;
  }
  res.render('faq', { title: 'Faq', user: user });
});

router.get('/forgetpassword', function (req, res, next) {
  var user = "";
  if (req.user != undefined && req.user != null) {
    user = req.user._doc.name;
  }
  res.render('forgetpassword', { title: 'Quên mật khẩu', user: user });
});

router.get('/confirmcode', function (req, res, next) {
  var user = "";
  if (req.user != undefined && req.user != null) {
    user = req.user._doc.name;
  }
  res.render('confirmcode', { title: 'Xác thực tài khoản', user: user });
});

router.get('/cart', function (req, res, next) {
  var user = "";
  if (req.user != undefined && req.user != null) {
    user = req.user._doc.name;
  }
  res.render('cart', { title: 'Quản lý giỏ hàng', user: user });
});

router.get('/delivery', function (req, res, next) {
  var user = "";
  if (req.user != undefined && req.user != null) {
    user = req.user._doc.name;
  }
  res.render('delivery', { title: 'Thông tin giao hàng', user: user });
});

router.get('/productspurchased', function (req, res, next) {
  var user = "";
  if (req.user != undefined && req.user != null) {
    user = req.user._doc.name;
  }
  res.render('productspurchased', { title: 'Thông tin giao hàng', user: user });
});

router.get('/informationaccount', function (req, res, next) {
  var user = "";
  if (req.user != undefined && req.user != null) {
    user = req.user._doc.name;
  }
  res.render('informationaccount', { title: 'Thông tin giao hàng', user: user });
});

router.get('/typeproducts', (req, res) => controller.ShowList(req, res));



module.exports = router;
