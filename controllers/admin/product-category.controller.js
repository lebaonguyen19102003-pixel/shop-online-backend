const ProductCategory = require("../../models/product-category.model");

const systemConfig = require("../../config/system");

const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelper(records);

  res.render("admin/pages/products-category/index", {
    titlePage: "Trang Danh Mục Sản Phẩm",
    records: newRecords
  });
}

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await ProductCategory.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công!");

  const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/products`;
  res.redirect(backUrl);
}

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const idsArray = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await ProductCategory.updateMany({ _id: { $in: idsArray } }, { status: "active" });
      req.flash("success", `Cập nhật trạng thái thành công ${idsArray.length} danh mục sản phẩm!`);
      break;
    case "inactive":
      await ProductCategory.updateMany({ _id: { $in: idsArray } }, { status: "inactive" });
      req.flash("success", `Cập nhật trạng thái thành công ${idsArray.length} danh mục sản phẩm!`);
      break;
    case "delete-all":
      await ProductCategory.updateMany({ _id: { $in: idsArray } }, {
        deleted: true,
        deletedAt: new Date()
      });
      req.flash("success", `Đã xóa thành công ${idsArray.length} danh mục sản phẩm!`);
      break;
    case "change-position":
      for(const item of idsArray) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await ProductCategory.updateOne({ _id: id }, { position: position });
      }
      req.flash("success", `Đã thay đổi vị trí thành công ${idsArray.length} danh mục sản phẩm!`);
      break;
    default:
      break;
  }

  const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/products-category`;
  res.redirect(backUrl);
}

// [PATCH] /admin/products-category/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await ProductCategory.updateOne({ _id: id }, {
    deleted: true,
    deletedAt: new Date()
  });

  req.flash("success", `Đã xóa thành công sản phẩm!`);

  const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/products-category`;
  res.redirect(backUrl);
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelper(records);

  res.render("admin/pages/products-category/create", {
    titlePage: "Trang Tạo Mới Danh Mục Sản Phẩm",
    records: newRecords
  });
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if(req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const records = await ProductCategory.find({
      deleted: false
    });

    const record = await ProductCategory.findOne({
      _id: id,
      deleted: false
    });

    const newRecords = createTreeHelper(records);

    res.render("admin/pages/products-category/edit", {
      titlePage: "Trang Sửa Đổi Danh Mục Sản Phẩm",
      records: newRecords,
      record: record
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  if(req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  if(req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    await ProductCategory.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}