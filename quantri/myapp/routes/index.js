var express = require('express');
var router = express.Router();
const Account = require("../controllers/user");
const controller = new Account();
const Product = require("../controllers/product");
const controllerProduct = new Product();

router.get('/up', (req, res)=>controllerProduct.Show(req,res));
router.get('/home', (req, res) => controllerProduct.ShowList(req, res));
router.get('/search',(req,res)=>controllerProduct.Search(req, res));
router.get('/qldonhang',async (req,res)=>controllerProduct.QLDongHang(req, res));
router.get('/order/o=:_id',async(req,res)=>controllerProduct.ChiTietDonHang(req, res));
router.get('/', (req, res) => controllerProduct.ShowList(req, res));


/* GET users listing. */
router.get('/logout', (req, res) => controllerProduct.ShowList(req, res, true));
// chưa xử lí



module.exports = router;
