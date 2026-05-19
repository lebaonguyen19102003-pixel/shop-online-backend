module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");

    const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/auth/login`;
    res.redirect(backUrl);

    return;
  }

  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu!");

    const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/auth/login`;
    res.redirect(backUrl);

    return;
  }

  next();
}