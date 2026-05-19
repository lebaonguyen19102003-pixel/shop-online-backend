const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/index", {
    titlePage: "Nhóm quyền",
    records: records
  });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    titalPage: "Trang Tạo Nhóm Quyền",
  });
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  record.save();

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/edit
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    let find = {
      _id: id,
      deleted: false
    };

    const record = await Role.findOne(find);

    res.render("admin/pages/roles/edit", {
      titalPage: "Trang Sửa Nhóm Quyền",
      record: record
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  try {
    await Role.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/permissions", {
    titalPage: "Trang Phân Quyền",
    records: records
  });
}

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);

  try {
    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }

  res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
}