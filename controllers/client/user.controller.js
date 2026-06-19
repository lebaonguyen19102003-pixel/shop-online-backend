const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");

const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    titlePage: "Đăng ký tài khoản"
  });
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email
  });

  if (existEmail) {
    req.flash("error", "Email đã tồn tại!");

    const backUrl = req.get('Referer') || `/user/register`;
    res.redirect(backUrl);

    return;
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");
}

// [GET] /user/login
module.exports.login = async (req, res) => {
  if (req.cookies.tokenUser) {
    res.redirect("/");
  } else {
    res.render("client/pages/user/login", {
      titlePage: "Đăng nhập tài khoản"
    });
  }
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = md5(req.body.password);

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");

    const backUrl = req.get('Referer') || `/user/login`;
    res.redirect(backUrl);

    return;
  }

  if (user.password != password) {
    req.flash("error", "Sai mật khẩu!");

    const backUrl = req.get('Referer') || `/user/login`;
    res.redirect(backUrl);

    return;
  }

  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa!");

    const backUrl = req.get('Referer') || `/user/login`;
    res.redirect(backUrl);

    return;
  }

  const cart = await Cart.findOne({
    user_id: user.id
  });

  if (cart) {
    res.cookie("cartId", cart.id);
  } else {
    await Cart.updateOne(
      {
        _id: req.cookies.cartId
      },
      {
        user_id: user.id
      }
    );
  }

  res.cookie("tokenUser", user.tokenUser);

  await User.updateOne(
    {
      tokenUser: user.tokenUser
    },
    {
      statusOnline: "online"
    }
  );

  res.redirect(`/`);
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  await User.updateOne(
    {
      tokenUser: req.cookies.tokenUser
    },
    {
      statusOnline: "offline"
    }
  );

  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
  res.redirect("/");
}

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    titlePage: "Lấy lại mật khẩu"
  });
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
    status: "active"
  }).select("-password");

  if (!user) {
    req.flash("error", "Email không tồn tại!");

    const backUrl = req.get('Referer') || `/user/register`;
    res.redirect(backUrl);

    return;
  }

  // Lưu thông tin vào DB
  const otp = generateHelper.generateRandomNumber(8);

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now()
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // Nếu tồn tại email thì gửi mã OTP qua email
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `
    Mã OTP để lấy lại mật khẩu là: <b>${otp}</b>. Thời hạn sử dụng là 5 phút.
  `;
  sendMailHelper.sendMail(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
}

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    titlePage: "Nhập mã OTP",
    email: email
  });
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if (!result) {
    req.flash("error", "OTP không hợp lệ!");

    const backUrl = req.get('Referer') || `/user/register`;
    res.redirect(backUrl);

    return;
  }

  const user = await User.findOne({
    email: email
  });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
}

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    titlePage: "Đật lại mật khẩu"
  });
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  if (req.body.password !== req.body.confirmPassword) {
    req.flash("error", "Xác nhận lại mật khẩu không khớp!");

    const backUrl = req.get('Referer') || `/user/register`;
    res.redirect(backUrl);

    return;
  }

  await User.updateOne(
    {
      tokenUser: req.cookies.tokenUser
    },
    {
      password: md5(req.body.password)
    }
  );

  res.redirect("/");
}

// [POST] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info", {
    titlePage: "Thông tin tài khoản",
  });
}

// [GET] /user/edit-info/:id
module.exports.editInfo = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      status: "active",
      deleted: false
    });

    res.render("client/pages/user/edit-info", {
      titlePage: "Trang Sửa Đổi Tài Khoản",
      user: user
    });
  } catch (error) {
    res.redirect(`/user/info`);
  }
}

// [PATCH] /user/edit-info/:id
module.exports.editInfoPatch = async (req, res) => {
  const id = req.params.id;

  const emailExist = await User.findOne({
    _id: { $ne: id },
    deleted: false,
    email: req.body.email
  });

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);

    const backUrl = req.get('Referer') || `/user/info`;
    res.redirect(backUrl);

    return;
  }

  if (req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    delete req.body.password;
  }

  try {
    await User.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }

  res.redirect(`/user/info`);
}