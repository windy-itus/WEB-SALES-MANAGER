var express = require('express');
var router = express.Router();
router.use(express.static("public"));
const passport = require('passport');
/* GET users listing. */
const Account = require("../controllers/user");
const controller = new Account();


/* GET users listing. */
// Handler login
router.get('/login', (req, res) => controller.ShowLogin(req, res, null));
router.post('/login', function (req, res, next) {
  passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/users/login-fail' })(req, res, next);
});
router.get('/login-fail', (req, res) => controller.ShowLogin(req, res, "Vui lòng nhập đúng tài khoản và mật khẩu đã đăng kí"));

//Handler register
router.post('/register-form', async (req, res) => controller.Register(req, res));

// Handler get info user
router.get('/forgetpassword', (req, res, next)=>controller.ForGetPassWord(req, res));
router.post('/confirm-account-to-reset-password', (req, res, next)=>controller.ConfirmPassWord(req, res));

module.exports = router;
