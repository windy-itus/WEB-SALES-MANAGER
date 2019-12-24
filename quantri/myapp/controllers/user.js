var User = require('../models/account');
var account = User.getAccount;
//test gui mail
var nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
var iduser_reset;
const jwt=require('jsonwebtoken');


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
          password: doc,
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
    res.render('forgetpassword', { title: 'Quên mật khẩu',user:req.user });
  }
  async SubmitForgetPassword(req, res) {
    const email = req.body.email;
    var token;
    var msg = "";
    var user = "";
    var iduser;
    if (req.user != undefined && req.user != null) {
      user = req.user;
    }
    await account.findOne({ email: email }).then(function (userdb) {
      var claims={
        sub:userdb.username,
        iss:'localhost:3000',
      }
        token = jwt.sign(claims,"khoa-itus",{
        expiresIn: '15m'
      });
      iduser = userdb._id;
      User.UpdateInfoAccount({ token: token }, userdb._id);
    })
      .catch((err) => {
        msg = "Email không được dùng để đăng kí tài khoản ứng dụng";
        res.render('forgetpassword', { title: 'Xác thực tài khoản', user, msg });
      });
    if (email.search("@gmail.com") == -1) {
      msg = "Email bạn nhập vào không tồn, vui lòng kiếm tra lại. Email có dạng: Example@gmail.com";
      res.render('forgetpassword', { title: 'Xác thực tài khoản', user, msg });
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
        html: '<p>Bạn vừa thực hiện yêu cầu reset password tại Đăng Khoa Store, nếu đó là bạn: <p><li><a href="http://localhost:3000/users/resetpassword/' + token + '"><b>Click here to reset password</b></a></li>'
      }
      transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
          console.log(err);
          errorr = "Hiện tại hệ thống không thể hỗ trợ bạn khôi phục mật khẩu. Bạn có thể thử lại lần sau!";
          res.render('forgetpassword', { title: 'Xác thực tài khoản', user, msg });
        } else {
          console.log('Message sent: ' + info.response);
          msg = "Hệ thống đã gửi mã xác minh đến "+ email+", vui lòng check mail để thực hiện resetpassword. Nếu không nhận được mail vui lòng kiểm tra email và thử lại";
          res.render('forgetpassword', { title: 'Xác thực tài khoản', user, msg });
        }
      });
    }
  }

  async ShowResetPassword(req, res) {
    const token = req.params.token;
    var isexist=false;
    jwt.verify(token, "khoa-itus", async (err, decoded) => {
      if (err) {
        console.log("hết hạn");
        res.send("Not found");
      }
      else{
      await account.findOne({ token: token }).then(function (doc) {
        isexist = true;
        iduser_reset = doc._id;
      })
        .catch((err) => {
          isexist = false;
        });
        if (isexist == true) {
          var user = "";
          if (req.user != undefined && req.user != null) {
            user = req.user._doc.name;
          }
          res.render('resetpassword', { title: 'Reset Password', user, token });
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
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    if (errors.length > 0) {
      res.render('resetpassword', { title: 'Reset Password', user, data: errors, newpw, renewpw,token });
    }
    else {

      await User.hashPassword(newpw).then(function (doc) {
        User.UpdateInfoAccount({ password: doc }, iduser_reset);
        var success = "Mật khẩu đã được đặt lại thành công";
        res.render('resetpassword', { title: 'Reset Password', user, success,token });
      })
        .catch((err) => {
          errors.push({ msg: 'Xảy ra lỗi, vui lòng thử lại' });
          res.render('resetpassword', { title: 'Reset Password', user, data: errors, newpw, renewpw,token });
        });
    }
  }
  
  ShowDelivery(req, res) {
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
      res.render('delivery', { title: 'Thông tin giao hàng', User: req.user });
    }
    //res.render('delivery', { title: 'Thông tin giao hàng' });

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