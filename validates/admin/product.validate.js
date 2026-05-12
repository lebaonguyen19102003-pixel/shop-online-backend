module.exports.createPost = (req, res, next) => {
  if(!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề sản phẩm!");
    
    const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/products`;
    res.redirect(backUrl);

    return;
  }

  next();
}