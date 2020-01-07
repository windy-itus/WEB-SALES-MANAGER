var User = require('../models/account');
var account = User.getAccount;
//test gui mail
var nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const MailConfig = require('../config/mail');
const modelOrder=require('../models/order');
const modelProductinOrder=require('../models/product_in_order');
const modelProduct=require('../models/product');
const moment = require('moment');
moment.locale('vi');


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
    await User.getOneAccount({ email: email }).then(function (doc) {
      if (doc != null || doc != undefined) errors.push({ msg: 'Email của bạn đã được sử dụng' });
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
          admin: false,
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
        const html = '<p>Bạn vừa thực hiện yêu cầu reset password tại Đăng Khoa Store, nếu đó là bạn: <p><li><a href="http://localhost:3000/users/activate-account-' + token + '"><b>Click here to reset password</b></a></li>'
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
  async DanhDauDaNhan(req,res){
    const id=req.params.id;
    await modelOrder.CheckStatusByQuery({_id:id},{status:1});
    res.redirect('/users/delivery');
  }
  async HuyDonHang(req,res){
    const id=req.params.id;
    await modelOrder.DeleteOrderByQuery({_id:id});
    await modelProductinOrder.deleteProductInOrder({_idOrder:id});
    res.redirect('/users/delivery');
  }
  ShowLogin(req, res, msg) {
    res.render('login', { title: 'Đăng nhập/Đăng ký', notice: msg, user:req.user,username:req.params.username});
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
          msg = "Hiện tại hệ thống không thể hỗ trợ bạn khôi phục mật khẩu. Bạn có thể thử lại lần sau!";
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
        await User.getOneAccount({ token: token }).then(function (doc) {
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

  async ShowDelivery(req, res) {
    var data = [];
    data = await modelOrder.getOrderByQuery({});
    var Data = [];
    for await(var doc of data){
      var status="";
        if (doc.status != 1) {
            if(doc.status==0) status="Chưa giao hàng";
            else status="Đang giao hàng";
            var listproduct=[];
            var listidproduct=await modelProductinOrder.getProductInOrderByQuery({_idOrder:doc._id});
            for await(var id of listidproduct){ 
              await modelProduct.getProductByIDString(id._idProduct).then((product)=>{
                listproduct.push(product);
              });
            }
            Data.push({date:doc.date=moment(doc.date).format('LL'),status:status,id:doc._id,listproduct:listproduct});
        }
    }
    res.render('delivery', { title: 'Thông tin giao hàng', Data: Data, user: req.user });
  }

  async showHistory(req, res) {
    const iduser = req.user._id;
    let idorder = [];
    let idproducts = [];
    let data = [];
    //console.log(iduser);
    const orders = await modelOrder.getOrderByQuery({ ID_Usser: iduser });
    //console.log(order);
    orders.forEach(function (doc) {
        if(doc.status==1)
        idorder.push(doc._id);
    });

    const products = await modelProductinOrder.getProductInOrderByQuery({ _idOrder: { $in: idorder } });

    products.forEach(function (doc) {
        idproducts.push(doc._idProduct);
    });
    await modelProduct.getListProductByQuery({}).then((docs) => {
        docs.forEach((doc) => {
            idproducts.forEach(function (id) {
                if (id == doc._id) {
                    data.push(doc);
                }
            });
        });
    });

    res.render('productspurchased', { title:'Sản phẩm đã mua',data: data, user:req.user });

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
        User.UpdateInfoAccount(user, {_id:iduser});
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
          User.UpdateInfoAccount({ password: doc }, {_id:iduser});
          var success = "Thay đổi thành công";
          res.render('changepassword', { title: 'Thay đổi mật khẩu', user: req.user, success });
        });
      }
    });

  }
}
module.exports = Account;