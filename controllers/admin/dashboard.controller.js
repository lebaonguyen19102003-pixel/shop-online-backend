const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  const statistics = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0
    }
  }

  // categoryProduct
  statistics.categoryProduct.total = await ProductCategory.countDocuments({});
  statistics.categoryProduct.active = await ProductCategory.countDocuments({ status: "active" });
  statistics.categoryProduct.inactive = await ProductCategory.countDocuments({ status: "inactive" });
  // End categoryProduct

  // product
  statistics.product.total = await Product.countDocuments({});
  statistics.product.active = await Product.countDocuments({ status: "active" });
  statistics.product.inactive = await Product.countDocuments({ status: "inactive" });
  // End product

  // account
  statistics.account.total = await Account.countDocuments({});
  statistics.account.active = await Account.countDocuments({ status: "active" });
  statistics.account.inactive = await Account.countDocuments({ status: "inactive" });
  // End account

  // user
  statistics.user.total = await User.countDocuments({});
  statistics.user.active = await User.countDocuments({ status: "active" });
  statistics.user.inactive = await User.countDocuments({ status: "inactive" });
  // End user

  res.render("admin/pages/dashboard/index", {
    titlePage: "Trang Tổng Quan",
    statistics: statistics
  })
}