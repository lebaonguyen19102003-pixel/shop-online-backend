const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productsHelper = require("../../helpers/products");
const productsCategoryHelper = require("../../helpers/product-category");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index", {
    titlePage: "Trang Danh Sách Sản Phẩm",
    products: newProducts
  });
}

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
  try {
    let find = {
      slug: req.params.slugProduct,
      status: "active",
      deleted: false
    };

    const product = await Product.findOne(find);

    if (product.category_id) {
      const category = await ProductCategory.findOne({
        _id: product.category_id,
        deleted: false,
        status: "active"
      });

      product.category = category;
    }

    const newProduct = productsHelper.priceNewProduct(product);

    res.render("client/pages/products/detail", {
      titlePage: product.title,
      product: newProduct
    });
  } catch (error) {
    res.redirect("/products");
  }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false,
    status: "active"
  });

  const subCategory = await productsCategoryHelper.getSubCategory(category.id);

  const subCategoryId = subCategory.map(item => {
    const id = item.id;
    return id;
  });

  const products = await Product.find({
    category_id: { $in: [category.id, ...subCategoryId] },
    deleted: false,
    status: "active"
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index", {
    titlePage: category.title,
    products: newProducts
  });
}