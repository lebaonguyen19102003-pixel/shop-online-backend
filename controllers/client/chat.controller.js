const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");

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

  // Xác định typeRoom là "friend" hay "group"
  const roomChat = await RoomChat.findOne({
    _id: roomChatId,
    deleted: false
  });

  const chatData = {
    avatar: "",
    name: ""
  };

  if (roomChat.typeRoom == "friend") {
    const myFriend = roomChat.users.find(user => user.user_id != userId);
    const myFriendInfo = await User.findOne({
      _id: myFriend.user_id,
      deleted: false
    }).select("avatar fullName");

    chatData.avatar = myFriendInfo.avatar;
    chatData.name = myFriendInfo.fullName;
  } else if (roomChat.typeRoom == "group") {
    chatData.avatar = roomChat.avatar;
    chatData.name = roomChat.title;
  }
  // Hết Xác định typeRoom là "friend" hay "group"

  res.render("client/pages/chat/index", {
    titlePage: "Chat",
    chats: chats,
    roomChatId: roomChatId,
    chatData: chatData
  });
}