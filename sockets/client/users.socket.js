const User = require("../../models/user.model");

module.exports = (socket) => {
  // CLIENT_SEND_ADD_FRIEND
  socket.on("CLIENT_SEND_ADD_FRIEND", async (data) => {
    const myUserId = data.myUserId;
    const userId = data.userId;

    // Thêm Id của A vào acceptFriends của B
    const existIdAinB = await User.findOne({
      _id: userId,
      acceptFriends: myUserId
    });

    if (!existIdAinB) {
      await User.updateOne(
        {
          _id: userId
        },
        {
          $push: { acceptFriends: myUserId }
        }
      );
    }
    // Hết Thêm Id của A vào acceptFriends của B

    // Thêm Id của B vào requestFriends của A
    const existIdBinA = await User.findOne({
      _id: myUserId,
      requestFriends: userId
    });

    if (!existIdBinA) {
      await User.updateOne(
        {
          _id: myUserId
        },
        {
          $push: { requestFriends: userId }
        }
      );
    }
    // Hết Thêm Id của B vào requestFriends của A
  });
  // End CLIENT_SEND_ADD_FRIEND

  // CLIENT_SEND_CANCEL_FRIEND
  socket.on("CLIENT_SEND_CANCEL_FRIEND", async (data) => {
    const myUserId = data.myUserId;
    const userId = data.userId;

    // Xóa Id của A khỏi acceptFriends của B
    const existIdAinB = await User.findOne({
      _id: userId,
      acceptFriends: myUserId
    });

    if (existIdAinB) {
      await User.updateOne(
        {
          _id: userId
        },
        {
          $pull: { acceptFriends: myUserId }
        }
      );
    }
    // Hết Xóa Id của A khỏi acceptFriends của B

    // Xóa Id của B khỏi requestFriends của A
    const existIdBinA = await User.findOne({
      _id: myUserId,
      requestFriends: userId
    });

    if (existIdBinA) {
      await User.updateOne(
        {
          _id: myUserId
        },
        {
          $pull: { requestFriends: userId }
        }
      );
    }
    // Hết Xóa Id của B khỏi requestFriends của A
  });
  // End CLIENT_SEND_CANCEL_FRIEND

  // CLIENT_SEND_REFUSE_FRIEND
  socket.on("CLIENT_SEND_REFUSE_FRIEND", async (data) => {
    const myUserId = data.myUserId;
    const userId = data.userId;

    // Xóa Id của A khỏi acceptFriends của B
    const existIdAinB = await User.findOne({
      _id: myUserId,
      acceptFriends: userId
    });

    if (existIdAinB) {
      await User.updateOne(
        {
          _id: myUserId
        },
        {
          $pull: { acceptFriends: userId }
        }
      );
    }
    // Hết Xóa Id của A khỏi acceptFriends của B

    // Xóa Id của B khỏi requestFriends của A
    const existIdBinA = await User.findOne({
      _id: userId,
      requestFriends: myUserId
    });

    if (existIdBinA) {
      await User.updateOne(
        {
          _id: userId
        },
        {
          $pull: { requestFriends: myUserId }
        }
      );
    }
    // Hết Xóa Id của B khỏi requestFriends của A
  });
  // End CLIENT_SEND_REFUSE_FRIEND

  // CLIENT_SEND_ACCEPT_FRIEND
  socket.on("CLIENT_SEND_ACCEPT_FRIEND", async (data) => {
    const myUserId = data.myUserId;
    const userId = data.userId;

    // Thêm {user_id, room_chat_id} của A vào friendList của B
    // Xóa Id của A khỏi acceptFriends của B
    const existIdAinB = await User.findOne({
      _id: myUserId,
      acceptFriends: userId
    });

    if (existIdAinB) {
      await User.updateOne(
        {
          _id: myUserId
        },
        {
          $push: {
            friendList: {
              user_id: userId,
              room_chat_id: ""
            }
          },
          $pull: { acceptFriends: userId }
        }
      );
    }
    // Hết Xóa Id của A khỏi acceptFriends của B
    // Hết Thêm {user_id, room_chat_id} của A vào friendList của B

    // Thêm {user_id, room_chat_id} của B vào friendList của A
    // Xóa Id của B khỏi requestFriends của A
    const existIdBinA = await User.findOne({
      _id: userId,
      requestFriends: myUserId
    });

    if (existIdBinA) {
      await User.updateOne(
        {
          _id: userId
        },
        {
          $push: {
            friendList: {
              user_id: myUserId,
              room_chat_id: ""
            }
          },
          $pull: { requestFriends: myUserId }
        }
      );
    }
    // Hết Xóa Id của B khỏi requestFriends của A
    // Hết Thêm {user_id, room_chat_id} của B vào friendList của A
  });
  // End CLIENT_SEND_ACCEPT_FRIEND
}