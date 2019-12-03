var express = require('express');
var router = express.Router();
const Product = require("../controllers/product");
const controller = new Product();
router.use(express.static("public"));



router.get('/', (req, res) => controller.ShowList(req, res));
router.get('/:id',async (req, res)=> controller.ShowDetail(req,res));
router.post('/', async (req, res) => controller.ShowIf(req,res));
router.get('/login', function (req, res, next) {
    res.render('login', { title: 'Đăng nhập' });
});

module.exports = router;