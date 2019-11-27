const db = require('../models/product');
/**
 * Class Articles Controller
 */
class Product {
  ShowList(req, res) {
    console.log("test day")
      res.render('viewlistproducts', { data:db })
  }
}

module.exports = Product;