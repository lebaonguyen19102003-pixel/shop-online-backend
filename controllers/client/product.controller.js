const Product = require("../../models/product.model");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }).sort({ position: "desc" });

  const newProducts = products.map(item => {
    item.priceNew = (item.price * (1 - item.discountPercentage / 100)).toFixed(0);
    return item;
  })

  res.render("client/pages/products/index", {
    titlePage: "Trang Danh Sách Sản Phẩm",
    products: newProducts
  });
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      status: "active",
      deleted: false
    });

    res.render("client/pages/products/detail", {
      titlePage: product.title,
      product: product
    });
  } catch (error) {
    res.redirect("/products");
  }
}
