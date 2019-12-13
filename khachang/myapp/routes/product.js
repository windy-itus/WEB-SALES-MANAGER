var express = require('express');
var router = express.Router();
const Product = require("../controllers/product");
const controller = new Product();
router.use(express.static("public"));

//Handler Show products
router.get('/:type', async (req, res) => controller.ShowProducts(req, res));
router.get('/', async (req, res) =>  controller.ShowProducts(req, res));
router.get('/detail/:id', async (req, res) => controller.ShowDetail(req, res));



module.exports = router;