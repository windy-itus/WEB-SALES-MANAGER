var express = require('express');
var router = express.Router();
const Account = require("../controllers/account");
const controller = new Account();

/* GET users listing. */
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Đăng nhập/Đăng ký' });
});
router.post('/login/register-form', async function (req, res) {
  controller.Register(req,res);
});
module.exports = router;
