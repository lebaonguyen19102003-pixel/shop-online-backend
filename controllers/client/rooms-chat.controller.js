const RoomChat = require("../../models/rooms-chat.model");
const User = require("../../models/user.model");

// [GET] /rooms-chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;

  const listRoomChat = await RoomChat.find({
    "users.user_id": userId,
    typeRoom: "group",
    deleted: false
  });

  if (listRoomChat.length > 0) {
    for (const room of listRoomChat) {
      const myInfo = room.users.find(user => user.user_id == userId);
      const myRole = myInfo.role;

      room.myRole = myRole;
    }
  }

  res.render("client/pages/rooms-chat/index", {
    titlePage: "Danh sách phòng",
    listRoomChat: listRoomChat
  });
}

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendList = res.locals.user.friendList;

  for (const friend of friendList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id,
      deleted: false
    }).select("fullName avatar");

    friend.infoFriend = infoFriend;
  }

  res.render("client/pages/rooms-chat/create", {
    titlePage: "Tạo phòng",
    friendList: friendList
  });
}

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersId = req.body.usersId;
  const avatar = req.body.avatar;

  const dataRoom = {
    title: title,
    avatar: avatar,
    typeRoom: "group",
    users: []
  };

  for (const userId of usersId) {
    dataRoom.users.push({
      user_id: userId,
      role: "user"
    });
  }

  dataRoom.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin"
  });

  const roomChat = new RoomChat(dataRoom);
  await roomChat.save();

  res.redirect(`/chat/${roomChat.id}`);
}

// [GET] /rooms-chat/edit/:roomChatId
module.exports.edit = async (req, res) => {
  const friendList = res.locals.user.friendList;
  const roomChatId = req.params.roomChatId;

  const roomChat = await RoomChat.findOne({
    _id: roomChatId,
    deleted: false
  });

  for (const friend of friendList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id,
      deleted: false
    }).select("fullName avatar");

    friend.infoFriend = infoFriend;
  }

  res.render("client/pages/rooms-chat/edit", {
    titlePage: "Sửa phòng",
    friendList: friendList,
    roomChat: roomChat
  });
}

// [PATCH] /rooms-chat/edit/:roomChatId
module.exports.editPatch = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  const title = req.body.title;
  const usersId = req.body.usersId;
  const avatar = req.body.avatar;

  console.log(avatar);
  console.log(usersId);

  const dataRoom = {
    title: title,
    avatar: avatar,
    typeRoom: "group",
    users: []
  };

  if (Array.isArray(usersId)) {
    for (const userId of usersId) {
      dataRoom.users.push({
        user_id: userId,
        role: "user"
      });
    }
  } else {
    dataRoom.users.push({
      user_id: usersId,
      role: "user"
    });
  }

  dataRoom.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin"
  });

  try {
    await RoomChat.updateOne({ _id: roomChatId }, dataRoom);
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }

  res.redirect(`/rooms-chat/edit/${roomChatId}`);
}