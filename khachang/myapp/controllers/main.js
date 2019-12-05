// class Home (commom)
class Home {
    ShowAbout(req, res) {
        var user = "";
        if (req.user != undefined && req.user != null) {
            user = req.user._doc.name;
        }
        res.render('about', { title: 'Về Chúng Tôi' ,user});
    }
    ShowContact(req, res) {
        var user = "";
        if (req.user != undefined && req.user != null) {
            user = req.user._doc.name;
        }
        res.render('contact', { title: 'Liên hệ',user });
    }
    ShowFaq(req, res) {
        var user = "";
        if (req.user != undefined && req.user != null) {
            user = req.user._doc.name;
        }
        res.render('faq', { title: 'Hỗ trợ' ,user});
    }
    ShowCart(req,res){
        var user = "";
        if (req.user != undefined && req.user != null) {
          user = req.user._doc.name;
        }
        res.render('cart',{ title: 'Quản lý giỏ hàng',user });
      }
    AddProductInCart(req,res){
        var dbsession=req.session;
        dbsession.cart=[];
        var idproduct = req.params.id;
        dbsession.cart.push(idproduct);
        console.log(idproduct);
        console.log(dbsession.cart);
        res.send(idproduct);
    }
}
module.exports = Home;