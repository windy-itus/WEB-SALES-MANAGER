
// class Home (commom)
class Home{
    ShowAbout(req,res){
        res.render('about', { title: 'Về Chúng Tôi' });
    }
    ShowContact(req,res){
        res.render('contact', { title: 'Liên hệ'});
    }
    ShowFaq(req,res){
        res.render('faq', { title: 'Hỗ trợ' });
    }
}
module.exports = Home;