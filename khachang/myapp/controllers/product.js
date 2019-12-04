const db = require('../models/product').getDBProduct();

/**
 * Class Articles Controller
 */
class Product {
  ShowList(req, res) {
    var fullproduct = db;
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    res.render('viewlistproducts', { data: fullproduct, user: user });
  }
  async ShowIf(req, res) {
    var dbif = [];
    var selectedOpt = req.body.Category;
    var cateId = await parseToInt(selectedOpt);
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    if (cateId == 0) res.render('viewlistproducts', { data: db, user: user });
    else {
      db.forEach(function (doc) {
        if (doc.id_category == cateId) dbif.push(doc);
      });
      res.render('viewlistproducts', { data: dbif, user: user });
    }

  }
  async ShowDetail(req, res) {
    var dbdetail = [];
    let dbrecommand=[];
    var idproduct = Number(req.params.id);
    let cateId;

    //var selectedOpt = req.body.Category;
    
    //var idproduct = await parseToInt(id);
    console.log(idproduct);
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    db.forEach(function (doc) {
      if (doc._id == idproduct) {
        dbdetail.push(doc);
        cateId=doc.id_category;
       }
    });
    
    db.forEach(function(doc){
      if(doc.id_category==cateId&&doc._id!=idproduct)
      {
        dbrecommand.push(doc);
      }
    })
    

    res.render('product', { data: dbdetail, user: user,recommand:dbrecommand });
  }
}
function parseToInt(x) {
  const parsed = parseInt(x, 32);
  if (isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

module.exports = Product;