const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// [GET] /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  // Lấy data từ database
  const chats = await Chat.find({
    deleted: false
  });

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id
    }).select("fullName");

    chat.infoUser = infoUser;
  }
  // Hết lấy data từ database

  res.render("client/pages/chat/index", {
    titlePage: "Chat",
    chats: chats
  });
}