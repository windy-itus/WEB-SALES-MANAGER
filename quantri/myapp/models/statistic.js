const mongoose = require('mongoose');

mongoose.connect(process.env.DATA, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoReconnect: true
});

var db = mongoose.connection;
var prodSchema = new mongoose.Schema({
    _id: Object,
    count: Number,
    count_sell: Number,
    description: String,
    discount: String,
    id_category: Number,
    image_link: String,
    name: String,
    price: Number
}, {
    collection: 'Product'
});
var orderSchema = new mongoose.Schema({
    _id: String,
    ID_Usser: Object,
    recipient: String,
    phone_number: String,
    address: String,
    status: Number,
    amount: String,
    date: Date
}, {
    collection: 'Order'
});
var productInOrderSchema = new mongoose.Schema({
    _id: Object,
    _idOrder: String,
    _idProduct: String
}, {
    collection: 'ProductInOrder'
});

const Product = db.useDb("ManagerStore").model("Product", prodSchema);
const Order = db.useDb("ManagerStore").model("Order", orderSchema);
const ProductInOrder = db.useDb("ManagerStore").model("ProductInOrder", productInOrderSchema);

module.exports.GetTop10Product = function () {
    return new Promise(function (resolve, reject) {
        Product.find({}).sort({ count_sell: -1 }).limit(10)
            .then((docs) => {
                let result = [];
                let index = 1;
                docs.forEach((doc) => {
                    result.push({
                        top: index++,
                        name: doc.name,
                        count_sell: doc.count_sell
                    });
                });
                resolve(result);
            });
    });
};
module.exports.GetStatistic = function (query) {
    return new Promise(function (resolve, reject) {
        Product.find({}).sort({ count_sell: -1 }).limit(10)
            .then((docs) => {
                let result = [];
                let index = 1;
                docs.forEach((doc) => {
                    result.push({
                        top: index++,
                        name: doc.name,
                        count_sell: doc.count_sell
                    });
                });
                resolve(result);
            });
    });
};