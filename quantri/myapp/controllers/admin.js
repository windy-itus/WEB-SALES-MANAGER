const modelUser = require('../models/account');
var accounts = modelUser.getAccount;
const modelStall= require('../models/stall');
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
        modelStall.ListStall({}).then((docs)=>{  
            res.render('systemstall',{title:'Hệ thống gian hàng',liststall:docs});
        }); 
    }
    ShowListProduct(req, res){
        const id=req.params.id;
        product.find({id_category:id}).then((docs)=>{
            res.render('listproduct',{title:'Sản phẩm gian hàng',listproduct :docs,idcategory:docs[0].id_category});
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
        modelStall.DeleteStall({id:id}).then((doc)=>{
            if(doc) console.log("Xóa thành công");
            res.redirect('/admin/system-stall');
        });
    }
    DetailProduct(req, res){
        const id=req.params.id;
        modelProduct.getProductByIDString(id).then((result)=>{
            res.render('detail-product',{title:'Chi tiết sản phẩm',data :result});
        });
    }
    DeleteProduct(req,res){
        var id=req.body.id;
        if(id==undefined|| id==null) id=req.params.id;
        modelProduct.getProductByIDString(id).then((result)=>{
            modelProduct.DeleteOneProduct({_id:result._id}).then((doc)=>{
                if(doc) console.log("xóa thành công");
                res.redirect('/admin/products-'+result.id_category);
            });
        });
    }

    ShowAddProduct(req,res){
        res.render('addproduct',{title:'Thêm sản phẩm',idcategory:req.params.idcategory});
    }

    async AddProduct(req,res){
        var notice;
        const name=req.body.name;
        const description=req.body.description;
        const image=req.body.url;
        const count=Number(req.body.count);
        const discount=req.body.discount;
        const price=Number(req.body.price);
        const id_category=Number(req.body.category);
        await modelProduct.getListProductByQuery({}).then((docs)=>{
            docs.forEach((doc)=>{
                if(doc.name==name) notice="sản phẩm tồn tại";
            });
        });
        if(notice!=undefined) {
            res.render('addproduct',{title:'Thêm sản phẩm',idcategory:req.params.idcategory,notice});
        }
        else{
        modelProduct.InsertOneProduct({name:name,
             description:description,
             image_link:image,
             count:count,
             discount:discount,
             price:price,
             id_category:id_category
            }).then((doc)=>{
                if(doc) console.log("Thêm thành công");
                res.redirect('/admin/addproduct-'+id_category);
            });
        }
    }
    async EditProduct(req,res){
        var notice;
        const name=req.body.name;
        const image=req.body.url;
        const description=req.body.description;
        const count=Number(req.body.count);
        const discount=req.body.discount;
        const price=Number(req.body.price);
        const id=req.body.id;
        await modelProduct.getListProductByQuery({}).then((docs)=>{
            docs.forEach((doc)=>{
                if(name==doc.name) notice='Sản phẩm đã tồn tại';
            });
        });
        if(notice!=undefined) {
            modelProduct.getProductByIDString(id).then((result)=>{
                res.render('detail-product',{title:'Chi tiết sản phẩm',data :result, notice});
            });
        }
        else{
        modelProduct.getProductByIDString(id).then((result)=>{
            modelProduct.UpdateOneProduct({name:name,
                description:description,
                image_link:image,
                count:count,
                discount:discount,
                price:price
               },{_id:result._id}).then((doc)=>{
                   if(doc) console.log("Sửa thành công");
                    res.redirect('/admin/detail-'+id);
               });
        });
        }   
    }
}
module.exports=Admin;