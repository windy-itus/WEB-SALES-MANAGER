var db=require('../models/account').register();
class Account {
    Register(req, res) {
        const username = req.body.username;
        const name=req.body.name;
        const password=req.body.password;
        const repassword=req.body.repassword;
        const email=req.body.email;
        const address=req.body.address;
        const phone=req.body.phone;
        let errors=[];
        const success="Đăng kí thành công";
        //check exist field
        if(!name||!username||!password||!repassword||!email||!address||!phone){
          errors.push({msg:'Vui lòng điền đầy đủ thông tin'});
        }
        if(password.length<7){
          errors.push({msg:'Mật khẩu phải có độ dài lớn hơn 6 ký tự'});
        }
        if(password!=repassword){
          errors.push({msg:'Mật khẩu không khớp'});
        }
        db.forEach(function(doc){
          if(doc.username==username) errors.push({msg:'Tên tài khoản đã tồn tại'});
        });
        if(errors.length>0){ 
          res.render('login',{data:errors
            ,name
            ,username
            ,password
            ,repassword
            ,email
            ,address
            ,phone
        });
        }else{
          res.render('login',{success});
        }
        
    }
}
module.exports=Account;