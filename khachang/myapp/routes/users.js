var express = require('express');
var router = express.Router();
router.use(express.static("public"));
const passport = require('passport');
const {ensureAuthenticated}=require('../config/auth');


//call controller account
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
router.post('/register-form',(req, res) => controller.Register(req, res));

// Handler get info user
router.get('/forgetpassword', (req, res, next)=>controller.ForGetPassWord(req, res));
router.post('/forgetpassword', (req, res, next)=>controller.SubmitForgetPassword(req, res));
router.get('/delivery', (req, res, next)=>controller.ShowDelivery(req, res));
router.get('/productspurchased', (req, res, next)=>controller.ShowProductPurchased(req, res));
router.get('/info-user',ensureAuthenticated, (req, res, next)=>controller.ShowInfoUser(req, res));
router.get('/change-info-user', (req, res) => controller.ShowChangeInfoUser(req, res));
router.post('/change-info-user', (req, res) => controller.ChangeInfo(req, res));
router.get('/changepassword',ensureAuthenticated,(req, res, next)=>controller.ShowChangePassword(req, res));
router.post('/changepassword', (req, res) => controller.ChangePassword(req, res));
router.get('/resetpassword-:token', (req,res) => controller.ShowResetPassword(req,res));
router.post('/resetpassword-:token', (req,res) => controller.ResetPassword(req,res));
router.get('/activate-account-:token', (req,res) => controller.ActivateAccount(req,res));

router.get('/info', (req,res) => controller.ShowInfoUser(req,res));





module.exports = router;
