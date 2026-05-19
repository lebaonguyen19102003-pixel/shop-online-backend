const md5 = require("md5");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false
    });
    record.role = role;
  }

  res.render("admin/pages/accounts/index", {
    titlePage: "Danh sách tài khoản",
    records: records
  });
}

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Account.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công!");

  const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/accounts`;
  res.redirect(backUrl);
}

// [PATCH] /admin/accounts/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Account.updateOne({ _id: id }, {
    deleted: true,
    deletedAt: new Date()
  });

  req.flash("success", `Đã xóa thành công tài khoản!`);

  const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/accounts`;
  res.redirect(backUrl);
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  };

  const roles = await Role.find(find);

  res.render("admin/pages/accounts/create", {
    titlePage: "Trang tạo tài khoản",
    roles: roles
  });
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    deleted: false,
    email: req.body.email
  });

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);

    const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/accounts`;
    res.redirect(backUrl);

    return;
  }

  req.body.password = md5(req.body.password);

  const account = new Account(req.body);
  await account.save();

  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false
  };

  try {
    const account = await Account.findOne(find);

    const roles = await Role.find({
      deleted: false
    });

    res.render("admin/pages/accounts/edit", {
      titlePage: "Trang Sửa Đổi Tài Khoản",
      account: account,
      roles: roles
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  const emailExist = await Account.findOne({
    _id: { $ne: id },
    deleted: false,
    email: req.body.email
  });

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);

    const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/accounts`;
    res.redirect(backUrl);

    return;
  }

  if (req.file) {
    req.body.avatar = `/uploads/${req.file.filename}`;
  }

  if (req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    delete req.body.password;
  }

  try {
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }

  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}