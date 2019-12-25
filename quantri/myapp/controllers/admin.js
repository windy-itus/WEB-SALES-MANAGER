// truy xuất database account
const modelUser = require('../models/account');
// truy xuất database category
const modelStall = require('../models/stall');
// truy xuất database product
const modelProduct = require('../models/product');

const modelOrder = require('../models/order');
const modelProductInOrder = require('../models/product_in_order');


class Admin {
    ShowHome(req,res){
        res.render('statistical',{title:'Trang chủ',user:req.user})
    }
    async ShowListUser(req, res) {
        var listuser = [];
        modelUser.getListAccountByQuery({}).then((docs) => {
            docs.forEach((doc) => {
                if (doc.username != req.user.username) {
                    listuser.push(doc);
                }
            });
            res.render('useraccounts', { title: 'Danh sách tài khoản người dùng', listacc: listuser,user:req.user });
        });
    }
    LockOrUnlock(req, res) {
        const username = req.params.username;
        modelUser.getOneAccount({ username: username }).then((doc) => {
            modelUser.UpdateInfoAccount({ lock: !doc.lock }, doc._id).then((result) => {
                res.redirect("/admin/user-account");
            });
        });
    }
    LockOrUnlockDetail(req, res) {
        const username = req.params.username;
        modelUser.getOneAccount({ username: username }).then((doc) => {
            modelUser.UpdateInfoAccount({ lock: !doc.lock }, doc._id).then((result) => {
                res.redirect("/admin/detail-info-" + username);
            });
        });
    }
    ViewDetailUser(req, res) {
        const username = req.params.username;
        modelUser.getOneAccount({ username: username }).then((doc) => {
            res.render('detail-user', { title: 'Thông tin chi tiết', info: doc ,user:req.user});
        });
    }

    ShowStalls(req, res) {
        modelStall.ListStall({}).then((docs) => {
            res.render('systemstall', { title: 'Hệ thống gian hàng', liststall: docs,user:req.user });
        });
    }
    ShowListProduct(req, res) {
        const id = req.params.id;
        modelProduct.getListProductByQuery({ id_category: id }).then((docs) => {
            res.render('listproduct', { title: 'Sản phẩm gian hàng', listproduct: docs, idcategory: docs[0].id_category ,user:req.user});
        });
    }
    async AddStall(req, res) {
        const name = req.body.namestall;
        var id;
        await modelStall.ListStall({}).then((docs) => {
            id = docs.length + 1;
        });

        modelStall.AddStall(name, id).then((doc) => {
            if (doc) console.log("Thêm thành công");
            res.redirect('/admin/system-stall');
        });
    }
    DeleteStall(req, res) {
        const id = Number(req.params.id);
        modelStall.DeleteStall({ id: id }).then((doc) => {
            if (doc) console.log("Xóa thành công");
            res.redirect('/admin/system-stall');
        });
    }
    DetailProduct(req, res) {
        const id = req.params.id;
        modelProduct.getProductByIDString(id).then((result) => {
            res.render('detail-product', { title: 'Chi tiết sản phẩm', data: result ,user:req.user});
        });
    }
    DeleteProduct(req, res) {
        var id = req.body.id;
        if (id == undefined || id == null) id = req.params.id;
        modelProduct.getProductByIDString(id).then((result) => {
            modelProduct.DeleteOneProduct({ _id: result._id }).then((doc) => {
                if (doc) console.log("xóa thành công");
                res.redirect('/admin/products-' + result.id_category);
            });
        });
    }

    ShowAddProduct(req, res) {
        res.render('addproduct', { title: 'Thêm sản phẩm', idcategory: req.params.idcategory,user:req.user });
    }

    async AddProduct(req, res) {
        var notice;
        const name = req.body.name;
        const description = req.body.description;
        const image = req.body.url;
        const count = Number(req.body.count);
        const discount = req.body.discount;
        const price = Number(req.body.price);
        const id_category = Number(req.body.category);
        await modelProduct.getListProductByQuery({}).then((docs) => {
            docs.forEach((doc) => {
                if (doc.name == name) notice = "sản phẩm tồn tại";
            });
        });
        if (notice != undefined) {
            res.render('addproduct', { title: 'Thêm sản phẩm', idcategory: req.params.idcategory, notice ,user:req.user});
        }
        else {
            modelProduct.InsertOneProduct({
                name: name,
                description: description,
                image_link: image,
                count: count,
                discount: discount,
                price: price,
                id_category: id_category
            }).then((doc) => {
                if (doc) console.log("Thêm thành công");
                res.redirect('/admin/addproduct-' + id_category);
            });
        }
    }
    async EditProduct(req, res) {
        var notice;
        const name = req.body.name;
        const image = req.body.url;
        const description = req.body.description;
        const count = Number(req.body.count);
        const discount = req.body.discount;
        const price = Number(req.body.price);
        const id = req.body.id;
        await modelProduct.getListProductByQuery({}).then((docs) => {
            docs.forEach((doc) => {
                if (name == doc.name) notice = 'Sản phẩm đã tồn tại';
            });
        });
        if (notice != undefined) {
            modelProduct.getProductByIDString(id).then((result) => {
                res.render('detail-product', { title: 'Chi tiết sản phẩm', data: result, notice,user:req.user });
            });
        }
        else {
            modelProduct.getProductByIDString(id).then((result) => {
                modelProduct.UpdateOneProduct({
                    name: name,
                    description: description,
                    image_link: image,
                    count: count,
                    discount: discount,
                    price: price
                }, { _id: result._id }).then((doc) => {
                    if (doc) console.log("Sửa thành công");
                    res.redirect('/admin/detail-' + id);
                });
            });
        }
    }
    async QLDongHang(req, res) {
        let data = [];
        data = await modelOrder.getOrderByQuery({});
        let Data = [];
        data.forEach(function (doc) {
            if (doc.status == 0) {
                doc.status = "Chưa giao hàng";
            }
            else {
                doc.status = "Đã giao hàng";
            }
            Data.push(doc);
        })
        res.render('QLdonhang', { Data: Data ,user:req.user});
    }
    async ChiTietDonHang(req, res) {
        let id_order = req.params.id;
        let data = [];
        let Data = [];
        let idproduct = [];
        data = await modelProductInOrder.getProductInOrderByQuery({_idOrder:id_order});
        
        await data.forEach(function (doc) {
            idproduct.push(doc._idProduct);
        });

        let sum = 0;
        Data = await modelProduct.getListProductByIDString(idproduct);
        Data.forEach(function (doc) {
            sum = sum + Number(doc.price);
        });
        console.log(Data);
        const order=await modelOrder.getOneOrderByQuery({_id:id_order});
        res.render('CTdonhang', { Data: Data, sum: sum,order:order,user:req.user });
    }
    DeleteOrder(req,res){
        let id_order = req.params.id;
            modelOrder.deleteOrder({_id:id_order}).then((doc)=>{
            if(doc) modelProductInOrder.deleteProductInOrder({_idOrder:id_order}).then((doc)=>{
                if(doc) res.redirect('/admin/qldonhang');
            });
        });
    }
}
module.exports = Admin;