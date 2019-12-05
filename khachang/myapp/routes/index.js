var express = require('express');
var router = express.Router();

// call controller product
const Product = require("../controllers/product");
const controllerProduct = new Product();

// call controller home
const Home = require("../controllers/main");
const controllerHome = new Home();

//handler logout
router.get('/logout', (req, res) => controllerProduct.ShowList(req, res, true));

//handler get home
router.get('/', (req, res) => controllerProduct.ShowList(req, res));
router.get('/home', (req, res) => controllerProduct.ShowList(req, res));
router.get('/about', (req, res, next) => controllerHome.ShowAbout(req, res));
router.get('/contact', (req, res, next) => controllerHome.ShowContact(req, res));
router.get('/faq', (req, res, next) => controllerHome.ShowFaq(req, res));
router.get('/cart', (req, res, next)=>controllerHome.ShowCart(req, res));
router.post('/add-in-cart/:id', (req, res, next) => controllerHome.AddProductInCart(req, res));

module.exports = router;
