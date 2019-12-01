const db = require('../models/product').getDBProduct();

/**
 * Class Articles Controller
 */
class Product {
  ShowList(req, res) {
      res.render('viewlistproducts', { data:db});
  }
  async ShowIf(req,res){
    var dbif=[];
    var selectedOpt = req.body.Category;  
    var cateId = await parseToInt(selectedOpt);
    if(cateId==0) res.render('viewlistproducts',{data:db});
    else{
      db.forEach(function(doc){
        if(doc.id_category==cateId) dbif.push(doc);
      });
      res.render('viewlistproducts',{data:dbif});
    }
    
  }
  async ShowDetail(req,res){
    var dbdetail=[];
    var id = req.params.id;
    var idproduct = await parseToInt(id);
    db.forEach(function(doc){
      if(doc._id==idproduct) dbdetail.push(doc);
    });
    res.render('product',{data:dbdetail});
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