var User = require('../models/account');
var account=User.getAccount;

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
    await account.find({}).then(function(doc){
      doc.forEach(function(data){
        if(data.username==username) errors.push({msg:'Tên tài khoản đã tồn tại'});
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
        console.log(doc);
        User.addAccount(name, username, doc, address, email, phone);
        res.render('login', { success });
      });
      errors.push({ msg: 'Đăng kí thất bại' });
    }

  }
  ShowLogin(req,res,msg){
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    res.render('login',{title:'Đăng nhập/Đăng ký',notice:msg,user});
  }
  ForGetPassWord(req,res){
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    res.render('forgetpassword', { title: 'Quên mật khẩu'});
  }
  ConfirmPassWord(req,res){
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    res.render('confirmcode', { title: 'Xác thực tài khoản',user});
  }
  ShowDelivery(req,res){
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    res.render('delivery', { title: 'Thông tin giao hàng',user});
  }
  ShowProductPurchased(req,res){
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    res.render('productspurchased', { title: 'Lịch sử giao hàng',user});
  }
  ShowInfoUser(req,res){
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    res.render('informationaccount', { title: 'Thông tin tài khoản',user});
  }
}
module.exports = Account;