const modelUser = require('../models/account');
var accounts = modelUser.getAccount;
const modelStall= require('../models/stall');
var stalls= modelStall.getCategory;
const modelProduct= require('../models/product');
var product= modelProduct.getProduct;


class Admin {
    async ShowListUser(req, res){
        var listuser=[];
        accounts.find({}).then((docs)=>{
            docs.forEach((doc)=>{
                if(doc.username!=req.user.username){
                    listuser.push(doc);
                }
            });
            res.render('useraccounts',{title:'Danh sách tài khoản người dùng',listacc:listuser});
        });    
    }
    LockOrUnlock(req, res){
        const username=req.params.username;
        var lock=false;
         accounts.findOne({username:username}).then((doc)=>{
            modelUser.UpdateInfoAccount({lock:!doc.lock},doc._id).then((result)=>{
                res.redirect("/admin/user-account");
            });   
        });
    }
    ViewDetailUser(req, res){
        const username=req.params.username;
        accounts.findOne({username:username}).then((doc)=>{
            res.render('detail-user',{title:'Thông tin chi tiết',info:doc});
        });
    }

    ShowStalls(req, res){
        stalls.find({}).then((docs)=>{
            res.render('systemstall',{title:'Hệ thống gian hàng',liststall :docs});
        }); 
    }
    ShowListProduct(req, res){
        const id=req.params.id;
        product.find({id_category:id}).then((docs)=>{
            res.render('listproduct',{title:'Sản phẩm gian hàng',listproduct :docs});
        });
    }
}

module.exports=Admin;