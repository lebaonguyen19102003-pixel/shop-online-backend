module.exports.registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập họ tên!");

    const backUrl = req.get('Referer') || `/user/register`;
    res.redirect(backUrl);

    return;
  }

  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");

    const backUrl = req.get('Referer') || `/user/register`;
    res.redirect(backUrl);

    return;
  }

  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu!");

    const backUrl = req.get('Referer') || `/user/register`;
    res.redirect(backUrl);

    return;
  }

  next();
}

module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");

    const backUrl = req.get('Referer') || `/user/login`;
    res.redirect(backUrl);

    return;
  }

  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu!");

    const backUrl = req.get('Referer') || `/user/login`;
    res.redirect(backUrl);

    return;
  }

  next();
}

module.exports.forgotPasswordPost = async (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");

    const backUrl = req.get('Referer') || `/user/register`;
    res.redirect(backUrl);

    return;
  }

  next();
}

module.exports.otpPasswordPost = async (req, res, next) => {
  if (!req.body.otp) {
    req.flash("error", "Vui lòng nhập OTP!");

    const backUrl = req.get('Referer') || `/user/register`;
    res.redirect(backUrl);

    return;
  }

  next();
}

module.exports.resetPasswordPost = async (req, res, next) => {
  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu mới!");

    const backUrl = req.get('Referer') || `/user/register`;
    res.redirect(backUrl);

    return;
  }

  if (!req.body.confirmPassword) {
    req.flash("error", "Vui lòng xác nhận lại mật khẩu mới!");

    const backUrl = req.get('Referer') || `/user/register`;
    res.redirect(backUrl);

    return;
  }

  next();
}