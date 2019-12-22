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
         accounts.findOne({username:username}).then((doc)=>{
            modelUser.UpdateInfoAccount({lock:!doc.lock},doc._id).then((result)=>{
                res.redirect("/admin/user-account");
            });   
        });
    }
    LockOrUnlockDetail(req,res){
        const username=req.params.username;
         accounts.findOne({username:username}).then((doc)=>{
            modelUser.UpdateInfoAccount({lock:!doc.lock},doc._id).then((result)=>{
                res.redirect("/admin/detail-info-"+username);
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
    async AddStall(req,res){
        const name=req.body.namestall;
        var id;
        await modelStall.ListStall({}).then((docs)=>{
            id=docs.length+1;
        });
        
        modelStall.AddStall(name,id).then((doc)=>{
            if(doc) console.log("Thêm thành công");
            res.redirect('/admin/system-stall');
        });
    }
    DeleteStall(req,res){
        const id=Number(req.params.id);
        console.log(id);
        modelStall.DeleteStall({id:id}).then((doc)=>{
            if(doc) console.log("Xóa thành công");
            res.redirect('/admin/system-stall');
        });
    }
}
module.exports=Admin;