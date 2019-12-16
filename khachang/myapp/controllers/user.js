var User = require('../models/account');
var account = User.getAccount;
//test gui mail
var nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

class Account {
  async Register(req, res) {
    const username = req.body.username;
    const name = req.body.name;
    const password = req.body.password;
    const repassword = req.body.repassword;
    const email = req.body.email;
    const address = req.body.address;
    const phone = req.body.phone;
    let errors = [];
    const success = "Đăng kí thành công";
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
    await account.find({}).then(function (doc) {
      doc.forEach(function (data) {
        if (data.username == username) errors.push({ msg: 'Tên tài khoản đã tồn tại' });
      })
    });
    if (errors.length > 0) {
      res.render('login', {
        data: errors
        , name
        , username
        , password
        , repassword
        , email
        , address
        , phone
      });
    } else {
      await User.hashPassword(password).then(function (doc) {
        const user = {
          name: name,
          username: username,
          password: password,
          phone: phone,
          email: email,
          address: address,
          type: "0"
        }
        User.addAccount(user);
        res.render('login', { success });
      });
      errors.push({ msg: 'Đăng kí thất bại' });
    }

  }
  ShowLogin(req, res, msg) {
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    res.render('login', { title: 'Đăng nhập/Đăng ký', notice: msg, user });
  }
  ForGetPassWord(req, res) {
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    res.render('forgetpassword', { title: 'Quên mật khẩu' });
  }
  ConfirmPassWord(req, res) {
    const email = req.body.email;
    var code=Array(16+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, 16);
    account.findOne({email:email}).then(function(userdb){
      User.UpdateInfoAccount({token:code},userdb._id);
    });
    var msg = "";
    var errorr = "";
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user;
    }
    if (email.search("@gmail.com") == -1) {
      errorr = "Email bạn nhập vào không tồn, vui lòng kiếm tra lại. Email có dạng: Example@gmail.com";
      res.render('forgetpassword', { title: 'Xác thực tài khoản', user, errorr });
    }
    else {
      
      var transporter = nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
          user: 'ad.appcreater@gmail.com',
          pass: 'qwertyuiop@123456789'
        }
      });
      var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Đăng Khoa Store',
        to: email,
        subject: '[XÁC MINH TÀI KHOẢN VÀ LẤY LẠI MẬT KHẨU]',
        text: '<a href="http://localhost:3000/users/resetpassword/"><b>Click here to reset password</b></a>',
        html: '<p>Bạn vừa thực hiện yêu cầu reset password tại Đăng Khoa Store, nếu đó là bạn: <p><li><a href="http://localhost:3000/resetpassword/'+ code+'"><b>Click here to reset password</b></a></li>'
      }
      transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
          console.log(err);
          errorr = "Hiện tại hệ thống không thể hỗ trợ bạn khôi phục mật khẩu. Bạn có thể thử lại lần sau!";
          res.render('confirmcode', { title: 'Xác thực tài khoản', user, msg, errorr });
        } else {
          console.log('Message sent: ' + info.response);
          msg = "Hệ thống đã gửi mã xác minh đến tài khoản của bạn, vui lòng check mail để xác minh và lấy lại lại khoản";
          res.render('confirmcode', { title: 'Xác thực tài khoản', user, msg, errorr });
        }
      });
    }
  }

  ResetPassword(req,res){
    const checktoken= User.checkToken(req.params.token);
    console.log(checktoken);
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    res.render('resetpassword', { title: 'Reset Password', user });
  }

  ShowDelivery(req, res) {
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    res.render('delivery', { title: 'Thông tin giao hàng', user });
  }
  ShowProductPurchased(req, res) {
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    res.render('productspurchased', { title: 'Lịch sử giao hàng', user });
  }
  ShowInfoUser(req, res) {
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user;
    }
    res.render('informationaccount', { title: 'Thông tin tài khoản', user });
  }

  ShowChangeInfoUser(req, res) {
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user;
    }
    res.render('changeinfo', { title: 'Thông tin tài khoản', info: user });
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
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user;
    }
    res.render('changepassword', { title: 'Thông tin tài khoản', user });
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
    if(newpassword.length<7) errors.push({ msg: 'Mật khẩu phải có độ dài lớn hơn 6' });
    bcrypt.compare(oldpassword, req.user.password, async (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        errors.push({ msg: 'Mật khẩu sai, vui lòng kiểm tra lại' });
      }
      if (errors.length > 0) {
        res.render('changepassword', { title: 'Thay đổi mật khẩu', user:req.user, info,data:errors });
      }
      else {
        await User.hashPassword(newpassword).then(function (doc) {
          User.UpdateInfoAccount({ password: doc },iduser);
          var success = "Thay đổi thành công";
          res.render('changepassword', { title: 'Thông tin tài khoản', user:req.user, success });
        });
      }
    });

  }
}
module.exports = Account;