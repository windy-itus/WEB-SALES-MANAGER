var express = require('express');
var router = express.Router();
const Product = require("../controllers/product");
const controller = new Product();


router.get('/', (req, res) => controller.ShowList(req, res));
router.get('/about', function (req, res, next) {
  res.render('about', { title: 'Về Chúng Tôi' });
});
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Đăng nhập' });
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
