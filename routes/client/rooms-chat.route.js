const express = require("express");
const multer = require('multer');
const router = express.Router();
const upload = multer();

const controller = require("../../controllers/client/rooms-chat.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  controller.createPost
);

router.get("/edit/:roomChatId", controller.edit);

router.patch(
  "/edit/:roomChatId",
  upload.single("avatar"),
  uploadCloud.upload,
  controller.editPatch
);

module.exports = router;