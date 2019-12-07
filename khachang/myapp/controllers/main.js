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
        var sum=0;
        if (dbsession.cart) {
            db.forEach(function (doc) {
                req.session.cart.forEach(function(idproduct){
                    let price=xulyChuoi(doc.price)
                    if(Number(idproduct)==doc._id)
                     {
                        data.push(doc);
                        sum=sum+price;
                    }
                });
            });
        }
        res.render('cart', { title: 'Quản lý giỏ hàng', user: dbsession.username,data:data,sum:sum});
    }
    AddProductInCart(req, res) {
        let pro=[];
        let recom=[];
        let cateid;
        //var dbsession = req.session;
        //dbsession.cart = [];
        var idproduct = req.params.id;
        if(req.session.cart==null)
        {
            req.session.cart=[];
        }
        req.session.cart.push(idproduct);
        //req.session.cart.push(5);

        db.forEach(function(doc){
            if(doc._id==idproduct)
            {
                pro.push(doc);
                cateid=pro.id_category;
            }
        });

        db.forEach(function(doc){
            if(doc.id_category==cateid)
            {
                recom.push(doc);
            }
        });
        var dbsession=req.session;
        console.log("1 sản phẩm đã được thêm vào giỏ hàng");
        res.render('product', { title: 'Sản phẩm', data: pro,recommand:recom,user:dbsession.username});
    }



    DeleteProductInCart(req, res)
    {       
        const id=req.params.id;
        req.session.cart.splice(req.session.cart.indexOf(id), 1);
        let dbsession=req.session;
        let data=[];
        let sum=0;

        if (dbsession.cart) {
            db.forEach(function (doc) {
                req.session.cart.forEach(function(idproduct){
                    let price=xulyChuoi(doc.price)
                    if(Number(idproduct)==doc._id)
                     {
                        data.push(doc);
                        sum=sum+price;
                    }
                });
            });
        }

        res.render('cart', { title: 'Quản lý giỏ hàng', user: dbsession.username,data:data,sum:sum});
    }
}

function xulyChuoi(x)
{
    //xoa "đ" cuối
    var len=x.length-1;
    x=x.substr(0,len);

    //xoa khoang cach
    while(x.indexOf(" ")!=-1)
    {
        x=x.substr(0,x.indexOf(" "))+x.substr(x.indexOf(" ")+1)
    }

    return Number(x);
}
module.exports = Home;