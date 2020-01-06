var User = require('../models/account');
var account = User.getAccount;
//test gui mail
var nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const MailConfig = require('../config/mail');


class Account {
  async Register(req, res) {
    const username = req.body.usernamedk;
    const name = req.body.name;
    const password = req.body.passworddk;
    const repassword = req.body.repassword;
    const email = req.body.email;
    const address = req.body.address;
    const phone = req.body.phone;
    let errors = [];
    var token;
    //check exist field
    if (!name || !username || !password || !repassword || !email || !address || !phone) {
      errors.push({ msg: 'Vui lòng điền đầy đủ thông tin' });
    }
    if (password.length < 7) {
      errors.push({ msg: 'Mật khẩu phải có độ dài lớn hơn 6 ký tự' });
    }
    if (password != repassword) {
      errors.push({ msg: 'Mật khẩu không khớp' });
    }
    await User.getOneAccount({username:username}).then(function (doc) {
      if (doc!=null||doc!= undefined) errors.push({ msg: 'Tên tài khoản đã tồn tại' });
  });
    if (errors.length > 0) {
      const info={name:name,username:username,password:password,repassword:repassword,email:email,address:address,phone:phone};
      res.render('login', {
        data: errors,
        info
      });
    } else {
      await User.hashPassword(password).then(async function (doc) {
        const user = {
          name: name,
          username: username,
          password: doc,
          phone: phone,
          email: email,
          address: address,
          admin: true,
          lock: false,
          activate: false
        }
        await User.addAccount(user).then((doc) => {
          var claims = {
            sub: username,
            iss: 'localhost:3000',
          }
          token = jwt.sign(claims, "khoa-itus", {
            expiresIn: '10m'
          });
          User.UpdateInfoAccount({ token: token }, { username: username });
        });
        const html = '<p>Bạn vừa thực hiện đăng kí tài khoản tại Đăng Khoa Store, nếu đó là bạn: <p><li><a href="http://localhost:3000/users/activate-account-' + token + '"><b>Nhấn vào đây để kích hoạt tài khoản</b></a></li>'
        const object = '[Đăng Khoa Store]-[KÍCH HOẠT TÀI KHOẢN]';
        MailConfig.SendMail(email, object, html).then((doc) => {
          if (doc) {
            const success = "Đăng kí thành công. Vui lòng kiểm tra email đã đăng kí để tiến hành kích hoạt tài khoản";
            res.render('login', { success });
          }
          else {
            const success = "Xảy ra lỗi";
            res.render('login', { success });
          }
        });
      });
      errors.push({ msg: 'Đăng kí thất bại' });
    }
  }
  ActivateAccount(req, res) {
    const token = req.params.token;
    jwt.verify(token, "khoa-itus", async (err, decoded) => {
      if (err) {
        console.log("hết hạn");
        res.send("Not found");
      }
      else {
        User.UpdateInfoAccount({ activate: true }, { token: token }).then(() => {
          res.send("Tài khoản của bạn đã được kích hoạt");
        })
          .catch((err) => {
            res.send(err);
          });
      }
    });
  }
  ShowLogin(req, res, msg) {
    if(req.user!=undefined&&req.user!=null) res.redirect('/admin/home');
    else res.render('login', { title: 'Đăng nhập/Đăng ký', notice: msg, user:req.user,username:req.params.username});
  }
  ShowLogOut(req, res){
    req.logout();
    req.session.destroy();
    res.render('login', { title: 'Đăng xuất'});
  }
  ForGetPassWord(req, res) {
    res.render('forgetpassword', { title: 'Quên mật khẩu', user: req.user });
  }
  async SubmitForgetPassword(req, res) {
    const email = req.body.email;
    var token;
    var msg = "";
    await User.getOneAccount({ email: email }).then(function (userdb) {
      var claims = {
        sub: userdb.username,
        iss: 'localhost:3000',
      }
      token = jwt.sign(claims, "khoa-itus", {
        expiresIn: '10m'
      });
      User.UpdateInfoAccount({ token: token }, { username: userdb.username });
    })
      .catch((err) => {
        msg = "Email không được dùng để đăng kí tài khoản ứng dụng";
        res.render('forgetpassword', { title: 'Xác thực tài khoản', user: req.user, msg });
      });
    if (email.search("@gmail.com") == -1) {
      msg = "Email bạn nhập vào không tồn, vui lòng kiếm tra lại. Email có dạng: Example@gmail.com";
      res.render('forgetpassword', { title: 'Xác thực tài khoản', user: req.user, msg });
    }
    else {
      const html = '<p>Bạn vừa thực hiện yêu cầu reset password tại Đăng Khoa Store, nếu đó là bạn: <p><li><a href="http://localhost:3000/users/resetpassword-' + token + '"><b>Click here to reset password</b></a></li>';
      const object = '[Đăng Khoa Store]-[XÁC THỰC TÀI KHOẢN VÀ LẤY LẠI MẬT KHẨU]';
      MailConfig.SendMail(email, object, html).then((doc) => {
        if (doc) {
          msg = "Hệ thống đã gửi mã xác minh đến " + email + ", vui lòng check mail để thực hiện resetpassword. Nếu không nhận được mail vui lòng kiểm tra email và thử lại";
          res.render('forgetpassword', { title: 'Xác thực tài khoản', user: req.user, msg });
        }
        else {
          errorr = "Hiện tại hệ thống không thể hỗ trợ bạn khôi phục mật khẩu. Bạn có thể thử lại lần sau!";
          res.render('forgetpassword', { title: 'Xác thực tài khoản', user: req.user, msg });
        }
      });
    }
  }

  async ShowResetPassword(req, res) {
    const token = req.params.token;
    var isexist = false;
    jwt.verify(token, "khoa-itus", async (err, decoded) => {
      if (err) {
        console.log("hết hạn");
        res.send("Not found");
      }
      else {
        await account.getOneAccount({ token: token }).then(function (doc) {
          isexist = true;
        })
          .catch((err) => {
            isexist = false;
          });
        if (isexist == true) {
          res.render('resetpassword', { title: 'Reset Password', user: req.user, token });
        }
      }
    });
  }

  async ResetPassword(req, res) {
    const token = req.params.token;
    const newpw = req.body.newpw;
    const renewpw = req.body.renewpw;
    var errors = [];
    if (!newpw || !renewpw) {
      errors.push({ msg: 'Vui lòng điền đầy đủ thông tin' });
    }
    if (newpw.length < 7) {
      errors.push({ msg: 'Mật khẩu phải có độ dài lớn hơn 6 ký tự' });
    }
    if (newpw != renewpw) {
      errors.push({ msg: 'Mật khẩu nhập lại không đúng' });
    }
    if (errors.length > 0) {
      res.render('resetpassword', { title: 'Reset Password', user: req.user, data: errors, newpw, renewpw, token });
    }
    else {
      User.getOneAccount({ token: token }).then((result) => {
        User.hashPassword(newpw).then(function (doc) {
          User.UpdateInfoAccount({ password: doc }, { username: result.username });
          var success = "Mật khẩu đã được đặt lại thành công";
          res.render('resetpassword', { title: 'Reset Password', user: req.user, success, token });
        })
          .catch((err) => {
            errors.push({ msg: 'Xảy ra lỗi, vui lòng thử lại' });
            res.render('resetpassword', { title: 'Reset Password', user: req.user, data: errors, newpw, renewpw, token });
          });
      });
    }
  }

  ShowDelivery(req, res) {
    res.render('delivery', { title: 'Thông tin giao hàng', user: req.user });
  }

  ShowProductPurchased(req, res) {
    res.render('productspurchased', { title: 'Lịch sử giao hàng', user: req.user });
  }
  ShowInfoUser(req, res) {
    res.render('informationaccount', { title: 'Thông tin tài khoản', user: req.user });
  }

  ShowChangeInfoUser(req, res) {
    res.render('changeinfo', { title: 'Thông tin tài khoản', info: req.user });
  }

  async ChangeInfo(req, res) {
    var errors = [];
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const phone = req.body.phone;
    const address = req.body.address;
    const iduser = req.user._id;
    const user = { name: name, username: username, phone: phone, address: address, email: email };
    const password = req.body.password;
    if (!name || !username || !email || !address || !phone) {
      errors.push({ msg: 'Vui lòng điền đầy đủ thông tin' });
    }
    bcrypt.compare(password, req.user.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        errors.push({ msg: 'Mật khẩu sai, vui lòng kiểm tra lại' });
      }
      if (errors.length > 0) {
        res.render('changeinfo', { title: 'Thông tin tài khoản', info: user, data: errors, password });
      }
      else {
        User.UpdateInfoAccount(user, iduser);
        var success = "Thay đổi thành công";
        res.render('changeinfo', { title: 'Thông tin tài khoản', info: user, success });
      }
    });
  }

  ShowChangePassword(req, res) {
    res.render('changepassword', { title: 'Thông tin tài khoản', user: req.user });
  }

  ChangePassword(req, res) {
    var errors = [];
    const oldpassword = req.body.oldpw;
    const newpassword = req.body.newpw;
    const renewpassword = req.body.renewpw;
    const iduser = req.user._id;
    const info = { oldpassword: oldpassword, newpassword: newpassword, renewpassword: renewpassword };
    if (!oldpassword || !newpassword || !renewpassword) {
      errors.push({ msg: 'Vui lòng điền đầy đủ thông tin' });
    }
    if (newpassword != renewpassword) errors.push({ msg: 'Nhập lại mật khẩu mới không đúng' });
    if (newpassword.length < 7) errors.push({ msg: 'Mật khẩu phải có độ dài lớn hơn 6' });
    bcrypt.compare(oldpassword, req.user.password, async (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        errors.push({ msg: 'Mật khẩu sai, vui lòng kiểm tra lại' });
      }
      if (errors.length > 0) {
        res.render('changepassword', { title: 'Thay đổi mật khẩu', user: req.user, info, data: errors });
      }
      else {
        await User.hashPassword(newpassword).then(function (doc) {
          User.UpdateInfoAccount({ password: doc }, iduser);
          var success = "Thay đổi thành công";
          res.render('changepassword', { title: 'Thay đổi mật khẩu', user: req.user, success });
        });
      }
    });

  }
}
module.exports = Account;