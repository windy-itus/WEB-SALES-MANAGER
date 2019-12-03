const db = require('../models/product').getDBProduct();

/**
 * Class Articles Controller
 */
class Product {
<<<<<<< HEAD
   ShowList(req, res) {
    var fullproduct=db;
      res.render('viewlistproducts', { data:fullproduct});
=======
  ShowList(req, res) {
    var fullproduct = db;
    //console.log(fullproduct);
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    res.render('viewlistproducts', { data: fullproduct, user: user });
>>>>>>> 0739f1f71c1cd5904d650dfc53b6f3aba404122c
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
    var idproduct = Number(req.params.id);
    //var idproduct = await parseToInt(id);
    //console.log(idproduct);
    var user = "";
    if (req.user != undefined && req.user != null) {
      user = req.user._doc.name;
    }
    db.forEach(function (doc) {
      if (doc._id == idproduct) dbdetail.push(doc);
    });
    res.render('product', { data: dbdetail, user: user });
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