
const product = require('../models/product').getProduct;

var categories = [
  { id: 0, name: "Tất cả" },
  { id: 1, name: "Điện thoại" },
  { id: 2, name: "Laptop" },
  { id: 3, name: "Loa" },
  { id: 4, name: "Tủ lạnh" },
  { id: 5, name: "Đồng hồ" },
  { id: 6, name: "Máy ảnh" }
];
var sortOpts = [
  { id: 0, name: "--" },
  { id: 1, name: "Tên A-Z" },
  { id: 2, name: "Tên Z-A" },
  { id: 3, name: "Giá thấp đến cao" },
  { id: 4, name: "Giá cao đến thấp" }
];
var filter = { selectedCate: 0, selectedSort: 0 }
const prodPerPage = 8; // product per page
const PREV = "page-prev";
const NEXT = "page-next";
/**
 * Class Articles Controller
 */
class Product {
  async ShowList(req, res, logout) {
    var login = req.session;
    if (logout) {
      login.username = null;
      if (req.user != null) req.user = null;
    }
    if (req.user != undefined && req.user != null) {
      login.username = req.user._doc.name;
    }
    // Get all product
    const fullproduct = await product.find({}).limit(prodPerPage);
    // Count how many products were found
    const numOfProducts = await product.count({});
    // Render the page
    res.render('viewlistproducts', {
      data: fullproduct,
      user: login.username,
      categories: categories,
      sortOpts: sortOpts,
      selectedCate: 0,
      selectedSort: 0,
      currentPage: 1,
      pages: Math.ceil(numOfProducts / prodPerPage)
    });
  }
  async ShowIf(req, res) {
    var query = {};
    var sort = {};
    var pageNo = 1;
    var pageDirect = "";
    var cateId = await parseToInt(req.body.Category);
    var sortId = await parseToInt(req.body.SortBy);
    var dbsession = req.session;
    // Check if previous or next page was click, then change page number
    if (req.body.pageNext != undefined && req.body.pageNext != null && req.body.pageNext !== "") {
      pageNo = await parseToInt(req.body.pageNext);
      pageDirect = NEXT;
    } else if (req.body.pagePrev != undefined && req.body.pagePrev != null && req.body.pagePrev !== "") {
      pageNo = await parseToInt(req.body.pagePrev);
      pageDirect = PREV;
    }
    // Set query
    if (cateId !== 0) query = { id_category: cateId };
    // Set sort order
    if (sortId === 1) sort = { name: 1 }; // name ascending
    else if (sortId === 2) sort = { name: -1 }; // name descending
    else if (sortId === 3) sort = { price: 1 }; // price ascending
    else if (sortId === 4) sort = { price: -1 }; // price descending
    // Count how many products were found
    var dbIf = await product.find(query);
    const numOfProducts = await product.count(query);
    // Total page numbers
    const totalPageNum = Math.ceil(numOfProducts / prodPerPage);
    // Page number management
    if (pageDirect === NEXT) {
      if (pageNo !== totalPageNum) pageNo = pageNo + 1;
    } else if (pageDirect === PREV) {
      if (pageNo !== 1) pageNo = pageNo - 1;
    }
    // Find filtered product
    dbIf = await product.find(query)
      .sort(sort)
      .limit(prodPerPage)
      .skip(prodPerPage * (pageNo - 1));
    // Render page
    res.render('viewlistproducts', {
      data: dbIf,
      user: dbsession.username,
      categories: categories,
      sortOpts: sortOpts,
      selectedCate: cateId,
      selectedSort: sortId,
      currentPage: pageNo,
      pages: totalPageNum
    });
  }
  // async Paging(req, res) {
  //   var query = {};
  //   var sort = {};
  //   var cateId = await parseToInt(req.body.Category);
  //   var sortId = await parseToInt(req.body.SortBy);
  //   var pageNo = await parseToInt(req.params.page);
  //   var direct = req.params.direct;
  //   var dbsession = req.session;
  //   // Set query
  //   if (cateId !== 0) query = { id_category: cateId };
  //   // Set sort order
  //   if (sortId === 1) sort = { name: 1 }; // name ascending
  //   else if (sortId === 2) sort = { name: -1 }; // name descending
  //   else if (sortId === 3) sort = { price: 1 }; // price ascending
  //   else if (sortId === 4) sort = { price: -1 }; // price descending
  //   // Check if previous or next page was click, then change page number
  //   if (direct === PREV) {
  //     if (pageNo > 0) pageNo = pageNo - 1;
  //   }
  //   // Find filtered product
  //   const dbIf = await product.find(query)
  //     .sort(sort)
  //     .limit(prodPerPage)
  //     .skip(prodPerPage * pageNo);
  //   // Count how many products were found
  //   const numOfProducts = await product.count(query);
  //   // Render page
  //   res.render('viewlistproducts', {
  //     data: dbIf,
  //     user: dbsession.username,
  //     categories: categories,
  //     sortOpts: sortOpts,
  //     selectedCate: cateId,
  //     selectedSort: sortId,
  //     currentPage: pageNo + 1,
  //     pages: Math.ceil(numOfProducts / prodPerPage)
  //   });
  // }
  async ShowDetail(req, res) {
    var dbdetail = [];
    var dbrecommand = [];
    var idproduct = Number(req.params.id);
    var dbsession = req.session;
    // Get product detail
    dbdetail = await product.find({ _id: idproduct });
    // Get recommended products
    dbrecommand = await product.find({
      id_category: dbdetail.id_category,
      _id: { $not: { $eq: idproduct } }
    });
    // Render page
    res.render('product', { data: dbdetail, recommand: dbrecommand, user: dbsession.username });
  }

  async ShowDienthoai(req, res) {
    var dbif = product.find({ id_category: 1 });
    res.render('viewtype', { data: dbif });
  }

  async ShowLaptop(req, res) {
    var dbif = product.find({ id_category: 2 });
    res.render('viewtype', { data: dbif });
  }

  async ShowMayanh(req, res) {
    var dbif = product.find({ id_category: 6 });
    res.render('viewtype', { data: dbif });
  }

  async ShowTulanh(req, res) {
    var dbif = product.find({ id_category: 4 });
    res.render('viewtype', { data: dbif });
  }

  async ShowDongho(req, res) {
    var dbif = product.find({ id_category: 5 });
    res.render('viewtype', { data: dbif });
  }

}
function parseToInt(x) {
  const parsed = parseInt(x, 32);
  if (isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

module.exports = Product;