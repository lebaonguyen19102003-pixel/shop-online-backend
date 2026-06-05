module.exports.editPatch = (req, res, next) => {
  if(!req.body.fullName) {
    req.flash("error", "Vui lòng nhập họ và tên!");
    
    const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/my-account`;
    res.redirect(backUrl);

    return;
  }

  if(!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    
    const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/my-account`;
    res.redirect(backUrl);

    return;
  }

  next();
}