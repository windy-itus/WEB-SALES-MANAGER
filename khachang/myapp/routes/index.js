var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://bibinbodongti:newwind@itus@cluster0-wm9nk.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoReconnect: true
});



router.get('/product', function (req, res, next) {
  client.connect(err => {
    var collection = client.db("ManagerStore").collection("Product");
    // perform actions on the collection object
    collection.find({}).toArray().then(docs => {
      res.render('viewlistproducts', { title: 'Trang chủ', data: docs });
    });
  });
  client.close();
});

router.post('/product', async function (req, res) {
  var selectedOpt = req.body.Category;
  var cateId = await parseToInt(selectedOpt);
  var query = { id_category: cateId };
  client.connect(err => {
    var collection = client.db("ManagerStore").collection("Product");
    // perform actions on the collection object
    if (cateId == 0) {
      collection.find({}).toArray().then(docs => {
        res.render('viewlistproducts', { title: 'Trang chủ', data: docs });
      });
    } else {
      collection.find(query).toArray().then(docs => {
        res.render('viewlistproducts', { title: 'Trang chủ', data: docs });
      });
    }
  });
  client.close();
});
router.get('/product/:id', async function (req, res) {
  var id=req.params.id;
  var idproduct = await parseToInt(id);
  var query = { _id: idproduct };
  client.connect(err => {
    var collection = client.db("ManagerStore").collection("Product");
    // perform actions on the collection object
      collection.find(query).toArray().then(docs => {
        res.render('product', { title: 'Trang chủ', data: docs });
      });
  });
  client.close();
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
  client.connect(err => {
    var collection = client.db("ManagerStore").collection("Product");
    // perform actions on the collection object
    collection.find({}).toArray().then(docs => {
      res.render('viewlistproducts', { title: 'Trang chủ', data: docs });
    });
  });
  client.close();
});
router.post('/', async function (req, res) {
  var selectedOpt = req.body.Category;
  var cateId = await parseToInt(selectedOpt);
  var query = { id_category: cateId };
  client.connect(err => {
    var collection = client.db("ManagerStore").collection("Product");
    // perform actions on the collection object
    if (cateId == 0) {
      collection.find({}).toArray().then(docs => {
        res.render('viewlistproducts', { title: 'Trang chủ', data: docs });
      });
    } else {
      collection.find(query).toArray().then(docs => {
        res.render('viewlistproducts', { title: 'Trang chủ', data: docs });
      });
    }
  });
  client.close();
});
router.get('/about.html', function (req, res, next) {
  res.render('about', { title: 'Về Chúng Tôi' });
});
router.get('/login.html', function (req, res, next) {
  res.render('login', { title: 'Đăng nhập' });
});
router.get('/contact.html', function (req, res, next) {
  res.render('contact', { title: 'Liên hệ' });
});
router.get('/preview.html', function (req, res, next) {
  res.render('preview', { title: 'Chi tiết sản phẩm' });
});
router.get('/preview-2.html', function (req, res, next) {
  res.render('preview2', { title: 'Chi tiết sản phẩm' });
});
router.get('/preview-4.html', function (req, res, next) {
  res.render('preview4', { title: 'Chi tiết sản phẩm' });
});
router.get('/preview-5.html', function (req, res, next) {
  res.render('preview5', { title: 'Chi tiết sản phẩm' });
});
router.get('/preview-6.html', function (req, res, next) {
  res.render('preview6', { title: 'Chi tiết sản phẩm' });
});
router.get('/products.html', function (req, res, next) {
  res.render('products', { title: 'Sản phẩm' });
});
router.get('/faq.html', function (req, res, next) {
  res.render('faq', { title: 'Faq' });
});
router.get('/forgetpassword.html', function (req, res, next) {
  res.render('forgetpassword', { title: 'Quên mật khẩu' });
});
router.get('/confirmcode.html', function (req, res, next) {
  res.render('confirmcode', { title: 'Xác thực tài khoản' });
});
router.get('/cart.html', function (req, res, next) {
  res.render('cart', { title: 'Quản lý giỏ hàng' });
});
router.get('/delivery.html', function (req, res, next) {
  res.render('delivery', { title: 'Thông tin giao hàng' });
});
router.get('/productspurchased.html', function (req, res, next) {
  res.render('productspurchased', { title: 'Thông tin giao hàng' });
});
router.get('/informationaccount.html', function (req, res, next) {
  res.render('informationaccount', { title: 'Thông tin giao hàng' });
});
router.get('/typeproducts.html', function (req, res, next) {
  res.render('typeproducts', { title: 'Các loại sản phẩm' });
});



module.exports = router;
