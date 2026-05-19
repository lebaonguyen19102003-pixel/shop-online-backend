const md5 = require("md5");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
  if (req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } else {
    res.render("admin/pages/auth/login", {
      titlePage: "Trang Đăng Nhập"
    });
  }
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = md5(req.body.password);

  const user = await Account.findOne({
    email: email,
    deleted: false
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");

    const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/auth/login`;
    res.redirect(backUrl);

    return;
  }

  if (user.password != password) {
    req.flash("error", "Sai mật khẩu!");

    const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/auth/login`;
    res.redirect(backUrl);

    return;
  }

  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa!");

    const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/auth/login`;
    res.redirect(backUrl);

    return;
  }

  res.cookie("token", user.token);

  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}