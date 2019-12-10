var express = require('express');
var router = express.Router();
const Account = require("../controllers/user");
const controller = new Account();
const Product = require("../controllers/product");
const controllerProduct = new Product();


router.get('/home', (req, res) => controllerProduct.ShowList(req, res));
router.get('/', (req, res) => controllerProduct.ShowList(req, res));


/* GET users listing. */
router.get('/logout', (req, res) => controllerProduct.ShowList(req, res, true));




// chưa xử lí



module.exports = router;
