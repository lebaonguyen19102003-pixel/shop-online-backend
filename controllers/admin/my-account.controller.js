const md5 = require("md5");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

// [GET] /admin/my-account
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    titlePage: "Thông Tin Cá Nhân"
  });
}

// [GET] /admin/my-account
module.exports.edit = (req, res) => {
  const user = res.locals.user;

  res.render("admin/pages/my-account/edit", {
    titlePage: "Chỉnh Sửa Thông Tin Cá Nhân",
    user: user
  });
}

// [PATCH] /admin/my-account
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;

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

  res.redirect(`${systemConfig.prefixAdmin}/my-account`);
}