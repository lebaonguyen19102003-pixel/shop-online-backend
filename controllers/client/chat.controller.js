const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  const roomChatId = req.params.roomChatId;

  // Lấy data từ database
  const chats = await Chat.find({
    room_chat_id: roomChatId,
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
    chats: chats,
    roomChatId: roomChatId
  });
}