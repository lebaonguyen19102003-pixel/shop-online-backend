const express = require("express");
const multer = require('multer');
const router = express.Router();
const upload = multer();

const controller = require("../../controllers/client/user.controller");
const validate = require("../../validates/client/user.validate");
const authMiddleware = require("../../middlewares/client/auth.middleware");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/register", controller.register);

router.post(
  "/register",
  validate.registerPost,
  controller.registerPost
);

router.get("/login", controller.login);

router.post(
  "/login",
  validate.loginPost,
  controller.loginPost
);

router.get("/logout", controller.logout);

// Quên mật khẩu
router.get("/password/forgot", controller.forgotPassword);

router.post(
  "/password/forgot",
  validate.forgotPasswordPost,
  controller.forgotPasswordPost
);

router.get("/password/otp", controller.otpPassword);

router.post(
  "/password/otp",
  validate.otpPasswordPost,
  controller.otpPasswordPost
);

router.get("/password/reset", controller.resetPassword);

router.post(
  "/password/reset",
  validate.resetPasswordPost,
  controller.resetPasswordPost
);

router.get(
  "/info",
  authMiddleware.requireAuth,
  controller.info
);

router.get(
  "/edit-info/:id",
  authMiddleware.requireAuth,
  controller.editInfo
);

router.patch(
  "/edit-info/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.editInfoPatch,
  controller.editInfoPatch
);

module.exports = router;