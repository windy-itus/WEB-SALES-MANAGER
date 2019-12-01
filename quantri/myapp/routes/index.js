var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('statistical', { title: 'Trang chủ' });
});

router.get('/managerbill.html', function(req, res, next) {
  res.render('managerbill', { title: 'Quản lý đơn hàng' });
});
router.get('/useraccounts.html', function(req, res, next) {
  res.render('useraccounts', { title: 'Quản lý Tài Khoản Người Dùng' });
});
router.get('/systemstall.html', function(req, res, next) {
  res.render('systemstall', { title: 'Quản lý các gian hàng' });
});
router.get('/products.html', function(req, res, next) {
  res.render('products', { title: 'Quản lý các gian hàng' });
});
router.get('/statistical.html', function(req, res, next) {
  res.render('statistical', { title: 'Thống Kê' });
});
router.get('/doanhso.html', function(req, res, next) {
  res.render('doanhso', { title: 'Doanh số' });
});
router.get('/top10.html', function(req, res, next) {
  res.render('top10', { title: 'Top 10' });
});
router.get('/informationaccount.html', function(req, res, next) {
  res.render('informationaccount', { title: 'Tài khoản' });
});
router.get('/login.html', function(req, res, next) {
  res.render('login', { title: 'Đăng nhập' });
});

module.exports = router;
