// truy xuất database account
const modelUser = require('../models/account');
// truy xuất database category
const modelStall = require('../models/stall');
// truy xuất database product
const modelProduct = require('../models/product');

const modelOrder = require('../models/order');
const modelProductInOrder = require('../models/product_in_order');
// truy xuất database statistic
const modelStatistic = require('../models/statistic');
const moment = require('moment');
var dateFormat = require('dateformat');
moment.locale('vi');
const {ObjectId} = require('mongodb');

const prodPerPage = 6; // product per page

class Admin {
    async ShowListUser(req, res) {
        //Phân trang
        var pageNo = 1; // always start at page 1
        var pageDirect = "";
        if (!isEmpty(req.query.PageNext)) {
            pageNo = Number(req.query.PageNext);
            pageDirect = "page-next";
        } else if (!isEmpty(req.query.PagePrev)) {
            pageNo = Number(req.query.PagePrev);
            pageDirect = "page-prev";
        }
        // Count how many products were found
        const numOfUser = await modelUser.count({});
        // Total page numbers
        const totalPageNum = Math.ceil(numOfUser / prodPerPage);
        // Page number management
        if (pageDirect === "page-next") {
            if (pageNo !== totalPageNum) pageNo = pageNo + 1;
        } else if (pageDirect === "page-prev") {
            if (pageNo !== 1) pageNo = pageNo - 1;
        }
        var listuser = [];
        modelUser.getListUserByIf({},prodPerPage,pageNo).then((docs) => {
            docs.forEach((doc) => {
                if (doc.username != req.user.username) {
                    listuser.push(doc);
                }
            });
            res.render('useraccounts', { title: 'Danh sách tài khoản người dùng', listacc: listuser, user: req.user,currentPage: totalPageNum === 0 ? totalPageNum : pageNo,pages: totalPageNum, });
        });
    }
    LockOrUnlock(req, res) {
        const username = req.params.username;
        modelUser.getOneAccount({ username: username }).then((doc) => {
            modelUser.UpdateInfoAccount({ lock: !doc.lock }, {_id:doc._id}).then((result) => {
                res.redirect("/admin/user-account");
            });
        });
    }
    LockOrUnlockDetail(req, res) {
        const username = req.params.username;
        modelUser.getOneAccount({ username: username }).then((doc) => {
            modelUser.UpdateInfoAccount({ lock: !doc.lock }, {_id:doc._id}).then((result) => {
                res.redirect("/admin/detail-info-" + username);
            });
        });
    }
    ViewDetailUser(req, res) {
        const username = req.params.username;
        modelUser.getOneAccount({ username: username }).then((doc) => {
            res.render('detail-user', { title: 'Thông tin chi tiết', info: doc, user: req.user });
        });
    }

    ShowStalls(req, res) {
        modelStall.ListStall({}).then((docs) => {
            res.render('systemstall', { title: 'Hệ thống gian hàng', liststall: docs, user: req.user });
        });
    }
    async ShowListProduct(req, res) {
        const id = req.params.id;
        var query = {};
        var sort = {};
        var pageNo = 1; // always start at page 1
        var pageDirect = "";
        var cateName = "";
        var price = Number(req.query.Price);
        var sortId = Number(req.query.SortBy);
        // Check if price is at priceRange
        if (price < 0 || price > 3) price = 0;
        // Check if sort is at sortOpts
        if (sortId < 0 || sortId > 4) sortId = 0;
        // Check if previous or next page was click, then change page number
        if (!isEmpty(req.query.PageNext)) {
            pageNo = Number(req.query.PageNext);
            pageDirect = "page-next";
        } else if (!isEmpty(req.query.PagePrev)) {
            pageNo = Number(req.query.PagePrev);
            pageDirect = "page-prev";
        }
        // Get query
        query = makeQuery(id, price);
        // Get sort order
        sort = makeSort(sortId);
        // Count how many products were found
        const numOfProducts = await modelProduct.count(query);
        // Total page numbers
        const totalPageNum = Math.ceil(numOfProducts / prodPerPage);
        // Page number management
        if (pageDirect === "page-next") {
            if (pageNo !== totalPageNum) pageNo = pageNo + 1;
        } else if (pageDirect === "page-prev") {
            if (pageNo !== 1) pageNo = pageNo - 1;
        }
        // Find filtered product
        const data = await modelProduct.getListProductByIf(query, sort, prodPerPage, pageNo);
        // Get category name
        cateName = await modelProduct.getCategoryName(id);
        res.render('listproduct', {
            title: 'Sản phẩm gian hàng',
            listproduct: data,
            idcategory: id,
            user: req.user,
            selPriceRange: price,
            selectedSort: sortId,
            currentPage: totalPageNum === 0 ? totalPageNum : pageNo,
            pages: totalPageNum,
            type: cateName
        });
    }
    async AddStall(req, res) {
        const name = req.body.namestall;
        var id;
        await modelStall.ListStall({}).then((docs) => {
            id = docs.length + 1;
        });

        modelStall.AddStall(name, id).then((doc) => {
            if (doc) console.log("Thêm thành công");
            res.redirect('/admin/system-stall');
        });
    }
    DeleteStall(req, res) {
        const id = Number(req.params.id);
        modelStall.DeleteStall({ id: id }).then((doc) => {
            if (doc) console.log("Xóa thành công");
            res.redirect('/admin/system-stall');
        });
    }
    DetailProduct(req, res) {
        const id = req.params.id;
        modelProduct.getProductByIDString(id).then((result) => {
            res.render('detail-product', { title: 'Chi tiết sản phẩm', data: result, user: req.user });
        });
    }
    DeleteProduct(req, res) {
        var id = req.body.id;
        if (id == undefined || id == null) id = req.params.id;
        modelProduct.getProductByIDString(id).then((result) => {
            modelProduct.DeleteOneProduct({ _id: ObjectId(id)}).then((doc) => {
                if (doc) console.log("xóa thành công");
                res.redirect('/admin/products-' + result.id_category);
            });
        });
    }

    ShowAddProduct(req, res) {
        const idcategory = Number(req.params.idcategory);
        modelStall.ListStall({}).then((docs) => {
            res.render('addproduct', { title: 'Thêm sản phẩm', idcategorychoose: idcategory, user: req.user, Categories: docs });
        });
    }

    async AddProduct(req, res) {
        var notice;
        const name = req.body.name;
        const description = req.body.description;
        const image = req.body.url;
        const count = Number(req.body.count);
        const discount = req.body.discount;
        const price = Number(req.body.price);
        const id_category = Number(req.body.Category);
        await modelProduct.getListProductByQuery({}).then((docs) => {
            docs.forEach((doc) => {
                if (doc.name == name) notice = "sản phẩm tồn tại";
            });
        });
        if (notice != undefined) {
            res.render('addproduct', { title: 'Thêm sản phẩm', idcategory: id_category, notice, user: req.user });
        }
        else {
            modelProduct.InsertOneProduct({
                name: name,
                description: description,
                image_link: image,
                count: count,
                discount: discount,
                price: price,
                count_sell: 0,
                id_category: id_category
            }).then((doc) => {
                if (doc) console.log("Thêm thành công");
                res.redirect('/admin/addproduct-' + id_category);
            });
        }
    }
    async EditProduct(req, res) {
        var notice;
        const name = req.body.name;
        const image = req.body.url;
        const description = req.body.description;
        const count = Number(req.body.count);
        const discount = req.body.discount;
        const price = Number(req.body.price);
        const id = req.body.id;
        await modelProduct.getListProductByQuery({}).then((docs) => {
            docs.forEach((doc) => {
                if (name == doc.name && id != doc.id) notice = 'Sản phẩm đã tồn tại';
            });
        });
        if (notice != undefined) {
            modelProduct.getProductByIDString(id).then((result) => {
                res.render('detail-product', { title: 'Chi tiết sản phẩm', data: result, notice, user: req.user });
            });
        }
        else {
            modelProduct.UpdateOneProduct({
                name: name,
                description: description,
                image_link: image,
                count: count,
                discount: discount,
                price: price
            }, { _id: ObjectId(id)}).then((doc) => {
                if (doc) console.log("Sửa thành công");
                res.redirect('/admin/detail-product-' + id);
            });
        }
    }
    async QLDonHang(req, res) {
        let data = [];
        data = await modelOrder.getOrderByQuery({});
        let Data = [];
        data.forEach(function (doc) {
            var status;
            if (doc.status == 0) {
                status="Chưa giao hàng"
            }
            else {
                if(doc.status==1)
                status = "Đã giao hàng";
                else status = "Đang giao hàng";
            }
            Data.push({ 
                id: doc._id,
                ID_Usser: doc.ID_Usser,
                recipient: doc.recipient,
                phone_number: doc.phone_number,
                address: doc.address,
                status: status,
                amount: doc.amount,
                date: moment(doc.date).format('LL'),
                note: doc.note});
        })
        res.render('QLdonhang', { Data: Data, user: req.user });
    }
    async ChiTietDonHang(req, res) {
        let id_order = req.params.id;
        let data = [];
        let Data = [];
        let idproduct = [];
        data = await modelProductInOrder.getProductInOrderByQuery({ _idOrder: id_order });

        await data.forEach(function (doc) {
            idproduct.push(doc._idProduct);
        });

        let sum = 0;
        Data = await modelProduct.getListProductByIDString(idproduct);
        Data.forEach(function (doc) {
            sum = sum + Number(doc.price);
        });
        console.log(Data);
        const order = await modelOrder.getOneOrderByQuery({ _id: id_order });
        res.render('CTdonhang', { Data: Data, sum: sum, order: order, user: req.user });
    }
    DeleteOrder(req, res) {
        let id_order = req.params.id;
        modelOrder.deleteOrder({ _id: id_order }).then((doc) => {
            if (doc) modelProductInOrder.deleteProductInOrder({ _idOrder: id_order }).then((doc) => {
                if (doc) res.redirect('/admin/qldonhang');
            });
        });
    }

    async ShowTop10(req, res) {
        const data = await modelStatistic.GetTop10Product();
        res.render('top10', { title: 'Top 10', user: req.user, data: data });
    }

    ShowHome(req, res) {
        // var statistic = 
        res.render('bieudo', { title: 'Doanh So', user: req.user });
    }
    ChitietDoanhThu(req, res) {
        var result = [];
        modelOrder.getOrderByQuery({ status: 1 }).then(async (docs) => {
            docs.reduce((ans, value) => {
                if (!ans[moment(value.date).format('LL')]) {
                    ans[moment(value.date).format('LL')] = { time: moment(value.date).format('LL'), count: 0, doanhthu: 0, month: dateFormat(value.date, "m"), year: dateFormat(value.date, "y") };
                    result.push(ans[moment(value.date).format('LL')]);
                }
                ans[moment(value.date).format('LL')].count++;
                ans[moment(value.date).format('LL')].doanhthu += value.amount;
                return ans;
            }, {});
            res.render('statistical', { title: 'Chi tiết doanh thu', user: req.user, data: result });
        });
    }

    ChitietDoanhThuByIf(req, res) {
        const condition = req.body.condition;
        var resultbyDate = [];
        var resultbyMonth = [];
        var resultbyYear = [];
        modelOrder.getOrderByQuery({ status: 1 }).then(async (docs) => {
            docs.reduce((ans, value) => {
                if (!ans[moment(value.date).format('LL')]) {
                    ans[moment(value.date).format('LL')] = { time: moment(value.date).format('LL'), count: 0, doanhthu: 0, month: dateFormat(value.date, "m"), year: dateFormat(value.date, "yyyy") };
                    resultbyDate.push(ans[moment(value.date).format('LL')]);
                }
                ans[moment(value.date).format('LL')].count++;
                ans[moment(value.date).format('LL')].doanhthu += value.amount;
                return ans;
            }, {});
            if (condition === "0") res.render('statistical', { title: 'Chi tiết doanh thu', user: req.user, data: resultbyDate,user:req.user,sel:condition});
            //Nếu thống kê theo tháng
            else {
                resultbyDate.reduce((ans, value) => {
                    if (!ans[value.month]) {
                        ans[value.month] = { time: 'Tháng ' + value.month + ' Năm ' + value.year, count: 0, doanhthu: 0, year: value.year };
                        resultbyMonth.push(ans[value.month]);
                    }
                    ans[value.month].count+=value.count;
                    ans[value.month].doanhthu += value.doanhthu;
                    return ans;
                }, {});
                if (condition === "1")
                    res.render('statistical', { title: 'Chi tiết doanh thu', user: req.user, data: resultbyMonth,user:req.user,sel:condition });
                //Nếu thống kê theo năm
                else {
                    resultbyMonth.reduce((ans, value) => {
                        if (!ans[value.year]) {
                            ans[value.year] = { time: 'Năm ' + value.year, count: 0, doanhthu: 0 };
                            resultbyYear.push(ans[value.year]);
                        }
                        ans[value.year].count+=value.count;
                        ans[value.year].doanhthu += value.doanhthu;
                        return ans;
                    }, {});
                    res.render('statistical', { title: 'Chi tiết doanh thu', user: req.user, data: resultbyYear,user:req.user,sel:condition});
                }
            }
        });
    }
    LoadChart(req,res){
        const condition=req.body.sel;
        var resultbyDate = [];
        var resultbyMonth = [];
        var resultbyYear = [];
        modelOrder.getOrderByQuery({ status: 1 }).then(async (docs) => {
            docs.reduce((ans, value) => {
                if (!ans[moment(value.date).format('LL')]) {
                    ans[moment(value.date).format('LL')] = { time: moment(value.date).format('LL'), count: 0, doanhthu: 0, month: dateFormat(value.date, "m"), year: dateFormat(value.date, "yyyy") };
                    resultbyDate.push(ans[moment(value.date).format('LL')]);
                }
                ans[moment(value.date).format('LL')].count++;
                ans[moment(value.date).format('LL')].doanhthu += value.amount;
                return ans;
            }, {});
            if (condition === "0") res.send(resultbyDate);
            //Nếu thống kê theo tháng
            else {
                resultbyDate.reduce((ans, value) => {
                    if (!ans[value.month]) {
                        ans[value.month] = { time: 'Tháng ' + value.month + ' Năm ' + value.year, count: 0, doanhthu: 0, year: value.year };
                        resultbyMonth.push(ans[value.month]);
                    }
                    ans[value.month].count+=value.count;
                    ans[value.month].doanhthu += value.doanhthu;
                    return ans;
                }, {});
                if (condition === "1") res.send(resultbyMonth);
                 //Nếu thống kê theo năm
                else {
                    resultbyMonth.reduce((ans, value) => {
                        if (!ans[value.year]) {
                            ans[value.year] = { time: 'Năm ' + value.year, count: 0, doanhthu: 0 };
                            resultbyYear.push(ans[value.year]);
                        }
                        ans[value.year].count+=value.count;
                        ans[value.year].doanhthu += value.doanhthu;
                        return ans;
                    }, {});
                    res.send(resultbyYear);
                }
            }
        });  
    }
    GiaoHang(req, res){
        const id=req.params.id;
        modelOrder.getOneOrderByQuery({_id:id}).then(async (doc)=>{
            if(doc.status==0) await modelOrder.CheckStatusByQuery({_id:id},{status:2});
            res.redirect('/admin/qldonhang');
        });
    }
}

function makeQuery(_cateId, _price) {
    var query = {};
    if (_price === 1) query = { id_category: _cateId, price: { $lt: 10000000 } };
    else if (_price === 2) query = { id_category: _cateId, price: { $gte: 10000000, $lte: 30000000 } };
    else if (_price === 3) query = { id_category: _cateId, price: { $gt: 30000000 } };
    else query = { id_category: _cateId };
    return query;
}
function makeSort(_sortId) {
    var sort = {};
    if (_sortId === 1) sort = { name: 1 }; // name ascending
    else if (_sortId === 2) sort = { name: -1 }; // name descending
    else if (_sortId === 3) sort = { price: 1 }; // price ascending
    else if (_sortId === 4) sort = { price: -1 }; // price descending
    return sort;
}
function isEmpty(val) {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

module.exports = Admin;