var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
var notes = require('../models/notes');
const uri = process.env.DATA;



router.get('/product', function (req, res, next) {
  MongoClient.connect(uri, function (err, client) {
    if (err) throw err;// throw if error
    // Connect to DB 'ManagerStore'
    var dbo = client.db("ManagerStore");
    // Get data from document 'Product'
    dbo.collection("Product").find({}).toArray(function (err, doc) {
      if (err) throw err;// throw if error
      // Render product.hbs with product data
      res.render('product', { title: 'Trang chủ', data: doc });
      client.close();// close connection
    });
  });
});

router.post('/product', async function (req, res) {
  var selectedOpt = req.body.Category;
  var cateId = await parseToInt(selectedOpt);
  var query = { id_category: cateId };
  MongoClient.connect(uri, function (err, client) {
    if (err) throw err;// throw if error
    // Connect to DB 'ManagerStore'
    var dbo = client.db("ManagerStore");
    // select 'All' option
    if (cateId == 0) {
      dbo.collection("Product").find({}).toArray(function (err, doc) {
        if (err) throw err;// throw if error
        // Render viewlistproducts.hbs with product data
        res.render('viewlistproducts', { title: 'Trang chủ', data: doc });
        client.close();// close connection
      });
    } else {  // other option
      dbo.collection("Product").find(query).toArray(function (err, doc) {
        if (err) throw err;// throw if error
        // Render viewlistproducts.hbs with product data
        res.render('viewlistproducts', { title: 'Trang chủ', data: doc });
        client.close();// close connection
      });
    }
  });
});
router.get('/product/:id', async function (req, res) {
  var id = req.params.id;
  var idproduct = await parseToInt(id);
  var query = { _id: idproduct };
  
  MongoClient.connect(uri, function (err, client) {
    if (err) throw err;// throw if error
    // Connect to DB 'ManagerStore'
    var dbo = client.db("ManagerStore");
    // Get data from document 'Product'
    dbo.collection("Product").find(query).toArray(function (err, doc) {
      if (err) throw err;// throw if error
      // Render product.hbs with product data
      res.render('product', { title: 'Trang chủ', data: doc });
      client.close();// close connection
    });
  });
});

function parseToInt(x) {
  const parsed = parseInt(x, 32);
  if (isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

/* GET home page. */
router.get('/', function (req, res, next) {
  MongoClient.connect(uri, function (err, client) {
    if (err) throw err;// throw if error
    // Connect to DB 'ManagerStore'
    var dbo = client.db("ManagerStore");
    // Get data from document 'Product'
    dbo.collection("Product").find({}).toArray(function (err, doc) {
      if (err) throw err;// throw if error
      // Render viewlistproducts.hbs with product data
      res.render('viewlistproducts', { title: 'Trang chủ', data: doc });
      client.close();// close connection
    });
  });
});

/* POST filter */
router.post('/', async function (req, res) {
  // get selected category
  var selectedOpt = req.body.Category;
  var cateId = await parseToInt(selectedOpt);
  // create condition query
  var query = { id_category: cateId };

  MongoClient.connect(uri, function (err, client) {
    if (err) throw err;// throw if error
    // Connect to DB 'ManagerStore'
    var dbo = client.db("ManagerStore");
    // select 'All' option
    if (cateId == 0) {
      dbo.collection("Product").find({}).toArray(function (err, doc) {
        if (err) throw err;// throw if error
        // Render viewlistproducts.hbs with product data
        res.render('viewlistproducts', { title: 'Trang chủ', data: doc });
        client.close();// close connection
      });
    } else {  // other option
      dbo.collection("Product").find(query).toArray(function (err, doc) {
        if (err) throw err;// throw if error
        // Render viewlistproducts.hbs with product data
        res.render('viewlistproducts', { title: 'Trang chủ', data: doc });
        client.close();// close connection
      });
    }
  });
});

router.get('/about', function (req, res, next) {
  res.render('about', { title: 'Về Chúng Tôi' });
});
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Đăng nhập' });
});
router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'Liên hệ' });
});
router.get('/preview', function (req, res, next) {
  res.render('preview', { title: 'Chi tiết sản phẩm' });
});
router.get('/preview-2', function (req, res, next) {
  res.render('preview2', { title: 'Chi tiết sản phẩm' });
});
router.get('/preview-4', function (req, res, next) {
  res.render('preview4', { title: 'Chi tiết sản phẩm' });
});
router.get('/preview-5', function (req, res, next) {
  res.render('preview5', { title: 'Chi tiết sản phẩm' });
});
router.get('/preview-6', function (req, res, next) {
  res.render('preview6', { title: 'Chi tiết sản phẩm' });
});
router.get('/products', function (req, res, next) {
  res.render('products', { title: 'Sản phẩm' });
});
router.get('/faq', function (req, res, next) {
  res.render('faq', { title: 'Faq' });
});
router.get('/forgetpassword', function (req, res, next) {
  res.render('forgetpassword', { title: 'Quên mật khẩu' });
});
router.get('/confirmcode', function (req, res, next) {
  res.render('confirmcode', { title: 'Xác thực tài khoản' });
});
router.get('/cart', function (req, res, next) {
  res.render('cart', { title: 'Quản lý giỏ hàng' });
});
router.get('/delivery', function (req, res, next) {
  res.render('delivery', { title: 'Thông tin giao hàng' });
});
router.get('/productspurchased', function (req, res, next) {
  res.render('productspurchased', { title: 'Thông tin giao hàng' });
});
router.get('/informationaccount', function (req, res, next) {
  res.render('informationaccount', { title: 'Thông tin giao hàng' });
});
router.get('/typeproducts', function (req, res, next) {
  res.render('typeproducts', { title: 'Các loại sản phẩm' });
});



module.exports = router;
