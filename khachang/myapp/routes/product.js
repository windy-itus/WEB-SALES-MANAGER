var express = require('express');
var router = express.Router();
const Product = require("../controllers/product");
const controller = new Product();
router.use(express.static("public"));

//Handler Show products
router.get('/', (req, res) => controller.ShowList(req, res));
router.get('/type=dien-thoai',async (req, res) => controller.ShowDienthoai(req, res));
router.get('/type=laptop',async (req, res) => controller.ShowLaptop(req, res));
router.get('/type=may-anh',async (req, res) => controller.ShowMayanh(req, res));
router.get('/type=dong-ho',async (req, res) => controller.ShowDongho(req, res));
router.get('/type=tu-lanh',async (req, res) => controller.ShowTulanh(req, res));
router.get('/:id',async (req, res)=> controller.ShowDetail(req,res));
router.post('/', async (req, res) => controller.ShowIf(req,res));



module.exports = router;