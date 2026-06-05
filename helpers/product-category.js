const ProductCategory = require("../models/product-category.model");

module.exports.getSubCategory = async (parent_id) => {
  const getCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      deleted: false,
      status: "active"
    });

    let allSubs = [...subs];

    for (const sub of subs) {
      const childs = await getCategory(sub.id);
      allSubs = allSubs.concat(childs);
    }

    return allSubs;
  }

  const subCategory = await getCategory(parent_id);
  return subCategory;
}