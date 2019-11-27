var express = require('express');
var router = express.Router();
const Product = require("../controllers/product");
const controller = new Product();

router.get('/', (req, res) => controller.ShowList(req, res));

module.exports = router;