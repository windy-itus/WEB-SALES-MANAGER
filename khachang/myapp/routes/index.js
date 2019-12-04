var express = require('express');
var router = express.Router();
const passport = require('passport');

//call controller account
const Account = require("../controllers/user");
const controller = new Account();

// call controller product
const Product = require("../controllers/product");
const controllerProduct = new Product();

// call controller home
const Home = require("../controllers/main");
const controllerHome = new Home();



/* GET  */




router.post('/register-form', async function (req, res) {
  controller.Register(req, res);
});

// handler login
router.get('/', (req, res) => controller.ShowLogin(req, res, null));
router.get('/login', (req, res) => controller.ShowLogin(req, res, null));
router.post('/login', function (req, res, next) {
  passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/login-fail' })(req, res, next);
});
router.get('/login-fail', (req, res) => controller.ShowLogin(req, res, "Vui lòng nhập đúng tài khoản và mật khẩu đã đăng kí"));

//handler logout
router.get('/logout', (req, res) => controllerProduct.ShowList(req, res, true));

//handler get home
router.get('/home', (req, res) => controllerProduct.ShowList(req, res));



// chưa xử lí
router.get('/about', (req, res, next) => controllerHome.ShowAbout(req, res));
router.get('/contact', (req, res, next) => controllerHome.ShowContact(req, res));
router.get('/faq', (req, res, next) => controllerHome.ShowFaq(req, res));



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
