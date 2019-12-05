// class Home (commom)
const db = require('../models/product').getDBProduct();
class Home {
    ShowAbout(req, res) {
        var dbsession = req.session;
        if (req.user != undefined && req.user != null) {
            dbsession.username = req.user._doc.name;
        }
        res.render('about', { title: 'Về Chúng Tôi', user: dbsession.username });
    }
    ShowContact(req, res) {
        var dbsession = req.session;
        res.render('contact', { title: 'Liên hệ', user: dbsession.username });
    }
    ShowFaq(req, res) {
        var dbsession = req.session;
        res.render('faq', { title: 'Hỗ trợ', user: dbsession.username });
    }
    ShowCart(req, res) {
        var data=[];
        var dbsession = req.session;
        if (dbsession.cart) {
            db.forEach(function (doc) {
                dbsession.cart.forEach(function(idproduct){
                    if(Number(idproduct)==doc._id) data.push(doc);
                });
            });
        }
        res.render('cart', { title: 'Quản lý giỏ hàng', user: dbsession.username,data:data});
    }
    AddProductInCart(req, res) {
        var dbsession = req.session;
        dbsession.cart = [];
        var idproduct = req.params.id;
        dbsession.cart.push(idproduct);
        console.log("1 sản phẩm đã được thêm vào giỏ hàng");
        res.render('product', { title: 'Sản phẩm', user: dbsession.username });
    }
}
module.exports = Home;