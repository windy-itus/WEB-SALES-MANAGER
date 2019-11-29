var express = require('express');
var router = express.Router();
const Product = require("../controllers/product");
const controller = new Product();

router.get('/', (req, res) => controller.ShowList(req, res));
router.post('/', async (req, res) => controller.ShowIf(req,res));

router.get('/:id',(req, res)=> controller.ShowDetail(req,res));

module.exports = router;