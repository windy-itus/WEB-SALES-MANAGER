const db = require('../models/product');
const dbd=require('../models/detailproduct')
/**
 * Class Articles Controller
 */
class Product {
  ShowList(req, res) {
      res.render('viewlistproducts', { data:db.getFullProduct})
  }
  async ShowIf(req,res){
    var selectedOpt = req.body.Category;
    var cateId = await parseToInt(selectedOpt);
    var query = { id_category: cateId };
    res.render('viewlistproducts',{data:db.getProductByIf(query)});
  }
  async ShowDetail(req,res){
    var id = req.params.id;
    var idproduct = await parseToInt(id);
    var query = { _id: idproduct };
    res.render('product',{data:dbd.getDetailProduct(query)});

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