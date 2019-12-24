// class Home (commom)
const modelProduct = require('../models/product');
const modelCart=require('../models/cart');
const db=modelProduct.getProduct
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
        var dtinCart=[];
        if(req.session.cart!= undefined&& req.session.cart !=null){
            dtinCart = req.session.cart;
        }
        
        if(req.user!= undefined) {
        await modelCart.getListCart({id_user:req.user.username}).then((docs)=>{
            docs.forEach((doc)=>{
                dtinCart.push(doc.id_product);
            })
        });
        }
        //_id: { $in: req.session.cart }
        if (dtinCart.length>0) {
            await modelProduct.getListProductByQuery({}).then(function (Data) {               
               Data.forEach((_data)=>{
                    dtinCart.forEach((doc)=>{
                        if(doc==_data._id)
                        {
                            data.push(_data);
                            sum=sum+_data.price;
                        }
                    });
               })
            });
        }
        res.render('cart', { title: 'Quản lý giỏ hàng', user: req.user, data: data, sum: sum });
    }

    async AddProductInCart(req, res) {
        let pro = [];
        let recom = [];
        var idproduct = req.params.id;
        if(req.user!=undefined&& req.user!=null){
            modelCart.addCart({id_user:req.user.username,id_product:idproduct});
        }
        else{
        if (req.session.cart == null) {
            req.session.cart = [];
        }
        req.session.cart.push(idproduct);
        }

        //pro = await db.find({ _id: idproduct });
        pro= await modelProduct.getListProductByIDString(idproduct);

        recom = await db.find({ _id: pro.id_category });

        console.log("1 sản phẩm đã được thêm vào giỏ hàng");
        res.render('product', { title: 'Sản phẩm', data: pro, recommand: recom, user: req.user });
    }

    async DeleteProductInCart(req, res) {
        const id = req.params.id;
        var data=[];
        var listcart=[];
        var sum = 0;
        if(req.user!=undefined&&req.user!=null){
            await modelCart.deleteCart({id_product:id}).then(async()=>{
                res.redirect("/cart");
            });
        }
        else{
        await req.session.cart.splice(req.session.cart.indexOf(id), 1);
        res.redirect("/cart");
        }

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
        let data=req.params.sum;
        if(data<=0)
        {
            data=null;
        }
        res.render('delivery', { title: 'thanh toán', sum: data, User:user});
    }
}

module.exports = Home;