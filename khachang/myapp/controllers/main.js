// class Home (commom)
const db = require('../models/product').getProduct;
var Order = require('../models/order');
const ID=require('uuid/v1');

class Home {
    ShowAbout(req, res) {
        var user;
        if (req.user != undefined && req.user != null) {
            user = req.user.name;
        }
        res.render('about', { title: 'Về Chúng Tôi', user });
    }
    ShowContact(req, res) {
        var user;
        if (req.user != undefined && req.user != null) {
            user = req.user.name;
        }
        res.render('contact', { title: 'Liên hệ', user});
    }
    ShowFaq(req, res) {
        var user;
        if (req.user != undefined && req.user != null) {
            user = req.user.name;
        }
        res.render('faq', { title: 'Hỗ trợ', user});
    }

    async ShowCart(req, res) {
        var data = [];
        var sum = 0;
        if (req.session.cart) {
            await db.find({ _id: { $in: req.session.cart } }).then(function (_data) {
                data = _data;
                _data.forEach(function (doc) {
                    sum = sum + doc.price;
                });
            });
        }
        res.render('cart', { title: 'Quản lý giỏ hàng', user: req.session.username, data: data, sum: sum });
    }

    async AddProductInCart(req, res) {
        let pro = [];
        let recom = [];
        var idproduct = req.params.id;
        if (req.session.cart == null) {
            req.session.cart = [];
        }
        req.session.cart.push(idproduct);

        pro = await db.find({ _id: idproduct });

        recom = await db.find({ _id: pro.id_category });

        console.log("1 sản phẩm đã được thêm vào giỏ hàng");
        res.render('product', { title: 'Sản phẩm', data: pro, recommand: recom, user: req.session.username });
    }

    async DeleteProductInCart(req, res) {
        const id = req.params.id;
        req.session.cart.splice(req.session.cart.indexOf(id), 1);
        let data = [];
        let sum = 0;

        if (req.session.cart) {
            await db.find({ _id: { $in: req.session.cart } }).then(function (_data) {
                data = _data;
                _data.forEach(function (doc) {
                    sum = sum + doc.price;
                });
            });
        }

        res.render('cart', { title: 'Quản lý giỏ hàng', user: req.session.username, data: data, sum: sum });
    }

    async Order(req,res)
    {
        const name=req.body.name;
        const sdt=req.body.sdt;
        const dc=req.body.address;
        const user=req.user;
        const id=user._id;
        const id_order= ID();
        const stt=0;
        const amou=req.body.sum;
        const Day=new Date();
         const success="Đặt hàng thành công";
         const fail="Vui lòng nhập đủ thông tin";
         let mess;

        let products=[];
        products= req.session.cart;

         const order = {
             _id:id_order,
             ID_Usser:id,
             recipient:name,
             phone_number:sdt,
             address:dc,
             status:stt,
             amount:amou,
             date:Day
         };

         let productsIncart=[];
         products.forEach(function(doc){
            const product={
                _idOrder:id_order,
                _idProduct:doc
            }

            productsIncart.push(product);
         });

        //console.log(name);
        if(!name||!sdt||!dc)
        {
            mess=fail;
        }
        else
        {
            mess=success;
            Order.addOrder(order,productsIncart);
        }
        res.render('delivery', {status:mess,name:name,sdt:sdt,address:dc,User:req.user, sum:amou});
    }

    ThanhToan(req,res)
    {
        const user=req.user;
        const data=req.params.sum;
        res.render('delivery', { title: 'thanh toán', sum: data, User:user});
    }
}

module.exports = Home;