const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const formSearchHelper = require("../../helpers/formSearch");
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  // Filter Status
  const filterStatus = filterStatusHelper(req.query);

  if (req.query.status) {
    find.status = req.query.status;
  }
  // End Filter Status

  // Form Search
  const objectSearch = formSearchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  // End Form Search

  // Pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );
  // End Pagination

  // Sort
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // End Sort

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  for (const product of products) {
    // Lấy ra thông tin người tạo
    const user = await Account.findOne({
      _id: product.createdBy.account_id
    });

    if (user) {
      product.accountFullName = user.fullName;
    }

    // Lấy ra thông tin người cập nhật gần nhất
    const updatedBy = product.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id
      });

      if (user) {
        updatedBy.accountFullName = userUpdated.fullName;
      }
    }
  }

  res.render("admin/pages/products/index", {
    titlePage: "Trang Danh Sách Sản Phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  };

  await Product.updateOne({ _id: id }, {
    status: status,
    $push: { updatedBy: updatedBy }
  });

  req.flash("success", "Cập nhật trạng thái thành công!");

  const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/products`;
  res.redirect(backUrl);
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const idsArray = req.body.ids.split(", ");

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  };

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: idsArray } }, {
        status: "active",
        $push: { updatedBy: updatedBy }
      });
      req.flash("success", `Cập nhật trạng thái thành công ${idsArray.length} sản phẩm!`);
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: idsArray } }, {
        status: "inactive",
        $push: { updatedBy: updatedBy }
      });
      req.flash("success", `Cập nhật trạng thái thành công ${idsArray.length} sản phẩm!`);
      break;
    case "delete-all":
      await Product.updateMany({ _id: { $in: idsArray } }, {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date()
        }
      });
      req.flash("success", `Đã xóa thành công ${idsArray.length} sản phẩm!`);
      break;
    case "change-position":
      for (const item of idsArray) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, {
          position: position,
          $push: { updatedBy: updatedBy }
        });
      }
      req.flash("success", `Đã thay đổi vị trí thành công ${idsArray.length} sản phẩm!`);
      break;
    default:
      break;
  }

  const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/products`;
  res.redirect(backUrl);
}

// [PATCH] /admin/products/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne({ _id: id }, {
    deleted: true,
    deletedBy: {
      account_id: res.locals.user.id,
      deletedAt: new Date()
    }
  });

  req.flash("success", `Đã xóa thành công sản phẩm!`);

  const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/products`;
  res.redirect(backUrl);
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  };

  const productCategories = await ProductCategory.find(find);
  const newProductCategories = createTreeHelper(productCategories);

  res.render("admin/pages/products/create", {
    titlePage: "Trang Tạo Mới Sản Phẩm",
    productCategories: newProductCategories
  });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy = {
    account_id: res.locals.user.id
  };

  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({ _id: id });

    const productCategories = await ProductCategory.find({
      deleted: false
    });
    const newProductCategories = createTreeHelper(productCategories);

    console.log(newProductCategories);

    res.render("admin/pages/products/edit", {
      titlePage: "Trang Sửa Đổi Sản Phẩm",
      product: product,
      productCategories: newProductCategories
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    };

    await Product.updateOne({ _id: id }, {
      ...req.body,
      $push: { updatedBy: updatedBy }
    });
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }

  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({ _id: id });

    res.render("admin/pages/products/detail", {
      titlePage: "Trang Chi Tiết Sản Phẩm",
      product: product
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}
