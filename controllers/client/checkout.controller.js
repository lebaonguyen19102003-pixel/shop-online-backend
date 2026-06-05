const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const productsHelper = require("../../helpers/products");

// [GET] /checkout
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId
  });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      let productInfo = await Product.findOne({
        _id: productId
      }).select("title thumbnail slug price discountPercentage");

      productInfo = productsHelper.priceNewProduct(productInfo);

      item.productInfo = productInfo;

      item.totalPrice = item.quantity * productInfo.priceNew;
    }
  }

  cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

  res.render("client/pages/checkout/index", {
    titlePage: "Đặt hàng",
    cartDetail: cart
  });
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;

  const cart = await Cart.findOne({
    _id: cartId
  });

  const products = [];

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      
      const productInfo = await Product.findOne({
        _id: item.product_id
      }).select("price discountPercentage");

      const objectProduct = {
        product_id: item.product_id,
        price: productInfo.price,
        discountPercentage: productInfo.discountPercentage,
        quantity: item.quantity
      };

      products.push(objectProduct);
    }
  }

  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products
  };

  const order = new Order(orderInfo);
  await order.save();

  await Cart.updateOne(
    {
      _id: cartId
    },
    {
      products: []
    }
  );

  // req.flash("success", "Đặt hàng thành công!");

  res.redirect(`/checkout/success/${order.id}`);
}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId
  });

  if (order.products.length > 0) {
    for (let product of order.products) {
      const productInfo = await Product.findOne({
        _id: product.product_id
      }).select("title thumbnail");

      product.productInfo = productInfo;
      product = productsHelper.priceNewProduct(product);
      product.totalPrice = product.quantity * product.priceNew;
    }
  }

  order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

  res.render("client/pages/checkout/success", {
    titlePage: "Đặt hàng thành công",
    order: order
  });
}