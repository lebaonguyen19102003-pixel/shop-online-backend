const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => {
  // Lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    deleted: false,
    status: "active",
    featured: "1"
  }).limit(6);

  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);
  // Hết lấy ra sản phẩm nổi bật

  // Hiển thị danh sách sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  }).sort({ position: "desc" }).limit(6);

  const newProductsNew = productsHelper.priceNewProducts(productsNew);
  // Hết Hiển thị danh sách sản phẩm mới nhất

  res.render("client/pages/home/index", {
    titlePage: "Trang Chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew
  });
}