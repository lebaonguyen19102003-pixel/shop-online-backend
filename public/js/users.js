const myUserId = document.querySelector("[user-has-entered]").getAttribute("user-has-entered");

// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");

      const userId = button.getAttribute("btn-add-friend");

      socket.emit("CLIENT_SEND_ADD_FRIEND", {
        myUserId: myUserId,
        userId: userId
      });
    });
  });
}
// Hết Chức năng gửi yêu cầu

// Chức năng hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");

      const userId = button.getAttribute("btn-cancel-friend");

      socket.emit("CLIENT_SEND_CANCEL_FRIEND", {
        myUserId: myUserId,
        userId: userId
      });
    });
  });
}
// Hết Chức năng hủy gửi yêu cầu

// Chức năng từ chối yêu cầu kết bạn
const refuseFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("refuse");

    const userId = button.getAttribute("btn-refuse-friend");

    socket.emit("CLIENT_SEND_REFUSE_FRIEND", {
      myUserId: myUserId,
      userId: userId
    });
  });
}

const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach(button => {
    refuseFriend(button);
  });
}
// Hết Chức năng từ chối yêu cầu kết bạn

// Chức năng chấp nhận yêu cầu kết bạn
const acceptFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("accepted");

    const userId = button.getAttribute("btn-accept-friend");

    socket.emit("CLIENT_SEND_ACCEPT_FRIEND", {
      myUserId: myUserId,
      userId: userId
    });
  });
}

const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach(button => {
    acceptFriend(button);
  });
}
// Hết Chức năng chấp nhận yêu cầu kết bạn

// SERVER_RETURN_LENGTH_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data) => {
  const badgeUsersAccept = document.querySelector(`[badge-users-accept="${data.userId}"]`);
  if (badgeUsersAccept) {
    badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
  }
});
// End SERVER_RETURN_LENGTH_ACCEPT_FRIENDS

// SERVER_RETURN_INFO_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIENDS", (data) => {

  // A bấm gửi kết bạn cho B => Vẽ A trong trang /accept của B
  const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userId}"]`);
  if (dataUsersAccept) {
    // Vẽ user ra giao diện
    const div = document.createElement("div");
    div.classList.add("col-6");
    div.setAttribute("user-id", data.infoUserA._id);

    div.innerHTML = `
      <div class="box-user">
        <div class="inner-avatar">
          <img
            src=${data.infoUserA.avatar}
            alt=${data.infoUserA.fullName}
          >
        </div>
        <div class="inner-info">
          <div class="inner-name">
            ${data.infoUserA.fullName}
          </div>
          <div class="inner-buttons">
            <button
              class="btn btn-sm btn-primary mr-1"
              btn-accept-friend=${data.infoUserA._id}
            >
              Chấp nhận
            </button>
            <button
              class="btn btn-sm btn-secondary mr-1"
              btn-refuse-friend=${data.infoUserA._id}
            >
              Xóa
            </button>
            <button
              class="btn btn-sm btn-secondary mr-1"
              btn-deleted-friend
              disabled
            >
              Đã xóa
            </button>
            <button
              class="btn btn-sm btn-primary mr-1"
              btn-accepted-friend
              disabled
            >
              Đã chấp nhận
            </button>
          </div>
        </div>
      </div>
    `;

    dataUsersAccept.appendChild(div);
    // Hết Vẽ user ra giao diện

    // Từ chối yêu cầu kết bạn
    const btnRefuseFriend = div.querySelector("[btn-refuse-friend]");
    refuseFriend(btnRefuseFriend);
    // Hết Từ chối yêu cầu kết bạn

    // Chấp nhận yêu cầu kết bạn
    const btnAcceptFriend = div.querySelector("[btn-accept-friend]");
    acceptFriend(btnAcceptFriend);
    // Hết Chấp nhận yêu cầu kết bạn
  }
  // Hết A bấm gửi kết bạn cho B => Vẽ A trong trang /accept của B

  // A bấm gửi kết bạn cho B => Xóa A trong trang /not-friend của B
  const dataUsersNotFriend = document.querySelector(`[data-users-not-friend="${data.userId}"]`);
  if (dataUsersNotFriend) {
    const boxUserRemove = dataUsersNotFriend.querySelector(`[user-id="${data.infoUserA._id}"]`);
    if (boxUserRemove) {
      dataUsersNotFriend.removeChild(boxUserRemove);
    }
  }
  // Hết A bấm gửi kết bạn cho B => Xóa A trong trang /not-friend của B
});
// End SERVER_RETURN_INFO_ACCEPT_FRIENDS

// SERVER_RETURN_USER_ID_CANCEL_FRIENDS
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIENDS", (data) => {
  const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userId}"]`);
  if (dataUsersAccept) {
    const boxUserRemove = dataUsersAccept.querySelector(`[user-id="${data.userIdA}"]`);
    if (boxUserRemove) {
      dataUsersAccept.removeChild(boxUserRemove);
    }
  }
});
// End SERVER_RETURN_USER_ID_CANCEL_FRIENDS