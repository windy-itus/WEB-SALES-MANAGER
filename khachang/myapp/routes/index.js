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
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Đăng nhập'});
});
router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'Liên hệ' });
});
router.get('/faq', function (req, res, next) {
  res.render('faq', { title: 'Faq' });
});
router.get('/forgetpassword', function (req, res, next) {
  res.render('forgetpassword', { title: 'Quên mật khẩu' });
});
router.get('/confirmcode', function (req, res, next) {
  res.render('confirmcode', { title: 'Xác thực tài khoản' });
});
router.get('/cart', function (req, res, next) {
  res.render('cart', { title: 'Quản lý giỏ hàng' });
});
router.get('/delivery', function (req, res, next) {
  res.render('delivery', { title: 'Thông tin giao hàng' });
});
router.get('/productspurchased', function (req, res, next) {
  res.render('productspurchased', { title: 'Thông tin giao hàng' });
});
router.get('/informationaccount', function (req, res, next) {
  res.render('informationaccount', { title: 'Thông tin giao hàng' });
});
router.get('/typeproducts', function (req, res, next) {
  res.render('typeproducts', { title: 'Các loại sản phẩm' });
});



module.exports = router;
