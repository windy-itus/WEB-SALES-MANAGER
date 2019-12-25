var express = require('express');
var router = express.Router();
const Account = require("../controllers/user");
const controller = new Account();


/* GET users listing. */
router.get('/logout', (req, res) => controller.ShowLogOut(req, res));
router.get('/', (req, res) => controller.ShowLogin(req, res));



module.exports = router;
