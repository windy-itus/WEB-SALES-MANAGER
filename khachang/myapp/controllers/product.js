
const product = require('../models/product').getProduct;
//const products=require('../models/product').getDBProduct();

var priceRange = [
  { id: 0, name: "Tất cả" },
  { id: 1, name: "Dưới 10 triệu" },
  { id: 2, name: "Từ 10 - 30 triệu" },
  { id: 3, name: "Trên 30 triệu" }
];
var sortOpts = [
  { id: 0, name: "--" },
  { id: 1, name: "Tên A-Z" },
  { id: 2, name: "Tên Z-A" },
  { id: 3, name: "Giá thấp đến cao" },
  { id: 4, name: "Giá cao đến thấp" }
];
const prodPerPage = 8; // product per page
// Direct page
const PREV = "page-prev";
const NEXT = "page-next";
// Product's Type
const DIEN_THOAI = "dien-thoai"
const LAPTOP = "laptop"
const MAY_ANH = "may-anh"
const DONG_HO = "dong-ho"
const TU_LANH = "tu-lanh"
/**
 * Class Product Controller
 */
class Product {
  async ShowProducts(req, res) {
    switch (req.params.type) {
      case DIEN_THOAI:
        await this.ShowProductsTemplate(req, res, 1, "Điện thoại", DIEN_THOAI)
        break;
      case LAPTOP:
        await this.ShowProductsTemplate(req, res, 2, "Laptop", LAPTOP)
        break;
      case TU_LANH:
        await this.ShowProductsTemplate(req, res, 4, "Tủ lạnh", TU_LANH)
        break;
      case DONG_HO:
        await this.ShowProductsTemplate(req, res, 5, "Đồng hồ", DONG_HO)
        break;
      case MAY_ANH:
        await this.ShowProductsTemplate(req, res, 6, "Máy lạnh", MAY_ANH)
        break;
      default:
        await this.ShowProductsTemplate(req, res, 0, "Sản phẩm")
        break;
    }
  }

  async ShowProductsTemplate(req, res, _categoryId, _title, _type) {
    var query = {};
    var sort = {};
    var pageNo = 1; // always start at page 1
    var pageDirect = "";
    var price = parseToInt(req.query.Price);
    var sortId = parseToInt(req.query.SortBy);
    // Check if price is at priceRange
    if (price < 0 || price > 3) price = 0;
    // Check if sort is at sortOpts
    if (sortId < 0 || sortId > 4) sortId = 0;
    // Get session info
    var user;
    // Set user name in session
    if (req.user != undefined && req.user != null) {
      user = req.user;
    }
    // Check if previous or next page was click, then change page number
    if (!isEmpty(req.query.PageNext)) {
      pageNo = parseToInt(req.query.PageNext);
      pageDirect = NEXT;
    } else if (!isEmpty(req.query.PagePrev)) {
      pageNo = parseToInt(req.query.PagePrev);
      pageDirect = PREV;
    }
    // Set query
    if (_categoryId !== 0) {
      if (price === 1) query = { id_category: _categoryId, price: { $lt: 10000000 } };
      else if (price === 2) query = { id_category: _categoryId, price: { $gte: 10000000, $lte: 30000000 } };
      else if (price === 3) query = { id_category: _categoryId, price: { $gt: 30000000 } };
      else query = { id_category: _categoryId };
    } else {
      if (price === 1) query = { price: { $lt: 10000000 } };
      else if (price === 2) query = { price: { $gte: 10000000, $lte: 30000000 } };
      else if (price === 3) query = { price: { $gt: 30000000 } };
    }
    // Set sort order
    if (sortId === 1) sort = { name: 1 }; // name ascending
    else if (sortId === 2) sort = { name: -1 }; // name descending
    else if (sortId === 3) sort = { price: 1 }; // price ascending
    else if (sortId === 4) sort = { price: -1 }; // price descending
    // Count how many products were found
    var data = await product.find(query);
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
    data = await product.find(query)
      .sort(sort)
      .limit(prodPerPage)
      .skip(prodPerPage * (pageNo - 1));
    // Render the page
    res.render('viewlistproducts', {
      data: data,
      user,
      priceRange: priceRange,
      sortOpts: sortOpts,
      selPriceRange: price,
      selectedSort: sortId,
      currentPage: totalPageNum === 0 ? totalPageNum : pageNo,
      pages: totalPageNum,
      type: _type,
      title: _title
    });
  }

  async ShowList(req, res, logout) {
    if (logout) {
      req.logout();
      req.session.destroy();
    }
    var user;
    if (req.user != undefined && req.user != null) user = req.user;
    // Get all product
    const fullproduct = await product.find({}).limit(prodPerPage);
    // Count how many products were found
    const numOfProducts = await product.count({});
    // Render the page
    res.render('viewlistproducts', {
      data: fullproduct,
      user,
      priceRange: priceRange,
      sortOpts: sortOpts,
      selPriceRange: 0,
      selectedSort: 0,
      currentPage: 1,
      pages: Math.ceil(numOfProducts / prodPerPage),
      title: "Sản phẩm"
    });
  }

  async ShowDetail(req, res) {
    var user;
    if (req.user != undefined && req.user != null) {
      user = req.user;
    }
    var dbdetail = [];
    var dbrecommand = [];
    var idproduct = Number(req.params.id);
    // Get product detail
    dbdetail = await product.find({ _id: idproduct });
    // Get recommended products
    dbrecommand = await product.find({
      id_category: dbdetail.id_category,
      _id: { $not: { $eq: idproduct } }
    });
    // Render page
    res.render('product', { data: dbdetail, recommand: dbrecommand, user });
  }

  async Search(req, res) {
    var regex = new RegExp(escapeRegex(req.query.key), 'gi');
    const data = await product.find({ name: regex });
    res.render('viewlistproducts', {
      data: data,
      user: req.session.username,
      priceRange: priceRange,
      sortOpts: sortOpts,
      selPriceRange: 0,
      selectedSort: 0,
      currentPage: 1,
      pages: 1,
      title: "Tìm kiếm"
    });
  }
}

function parseToInt(x) {
  const parsed = parseInt(x, 32);
  return isNaN(parsed) ? 0 : parsed;
}

function isEmpty(val) {
  return (val === undefined || val == null || val.length <= 0) ? true : false;
}

function escapeRegex(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = Product;