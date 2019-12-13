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
router.get('/up', (req, res) => controllerProduct.Show(req, res));
router.get('/home', (req, res) => controllerProduct.ShowList(req, res));
router.get('/about', (req, res) => controllerHome.ShowAbout(req, res));
router.get('/contact', (req, res) => controllerHome.ShowContact(req, res));
router.get('/faq', (req, res) => controllerHome.ShowFaq(req, res));
router.get('/cart', async (req, res)=>controllerHome.ShowCart(req, res));
router.get('/search',(req,res)=>controllerProduct.Search(req, res));
router.post('/add-in-cart/:id', async (req, res) => controllerHome.AddProductInCart(req, res));
router.post('/delete/:id', async (req, res) => controllerHome.DeleteProductInCart(req, res))

module.exports = router;
