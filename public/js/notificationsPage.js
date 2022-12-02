$(document).ready(() => {
  $.get("/api/notifications", (data) => {
    // console.log(data);
    outputNotificationList(data, $(".resultsContainer"));
  });
});

$("#markNotificationAsRead").click(()=>markNotificationsAsOpened())

function outputNotificationList(notifications, container) {
  notifications.forEach((notification) => {
    var html = createNotificationHtml(notification);
    container.append(html);
  });

  if (notifications.length == 0) {
    container.append("<span class='noResults'>Nothing to show.</span>");
  }
}

function createNotificationHtml(notification) {
    var userFrom = notification.userFrom;
    var className = notification.opened ? "" : "active";
    var url = getNotificationUrl(notification)

  return `<a href='${url}' class='resultListItem notification ${className}'data-id='${notification._id}'>
        <div class="resultsImageContainer">
        <img src='${userFrom.profilePic}'>
        </div>
        <div class='resultsDetailsContainer ellipsis'>
        <span class='ellipsis'>${getNotificationText(notification)}</span>
        </div>
    </a>`;
}

function getNotificationText(notification) {
  var userFrom = notification.userFrom;

  if (!userFrom.firstName || !userFrom.lastName) {
    return alert("user from data not populated");
  }

  var userFromName = `${userFrom.firstName} ${userFrom.lastName}`;

  var text;

  if (notification.notificationType == "retweet") {
    text = `${userFromName} retweeted one of your posts`;
  } else if (notification.notificationType == "postLike") {
    text = `${userFromName} liked one of your posts`;
  } else if (notification.notificationType == "reply") {
    text = `${userFromName} repied to one of your posts`;
  } else if (notification.notificationType == "follow") {
    text = `${userFromName} followed you`;
  }

  return `<span class='ellipsis'>${text}</span>`;
}

function getNotificationUrl(notification) {
  var url = "#";

  if (
    notification.notificationType == "retweet" ||
    notification.notificationType == "postLike" ||
    notification.notificationType == "reply"
  ) {
    url = `/posts/${notification.entityId} retweeted one of your posts`;
  } else if (notification.notificationType == "follow") {
    url = `/profile/${notification.entityId} followed you`;
  }

  return url;
}
