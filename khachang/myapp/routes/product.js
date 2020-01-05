var express = require('express');
var router = express.Router();
const Product = require("../controllers/product");
const controller = new Product();
// router.use(express.static("public"));

//Handler Show products
router.get('/:type',(req, res) => controller.ShowProducts(req, res));
router.get('/',(req, res) =>  controller.ShowProducts(req, res));
router.get('/detail/:id',(req, res) => controller.ShowDetail(req, res));
router.post('/addcomment',(req,res)=>controller.AddComment(req,res));
router.post('/loadcomment',(req,res)=>controller.LoadComment(req,res));



module.exports = router;