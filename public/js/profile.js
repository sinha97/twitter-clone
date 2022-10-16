$(document).ready(() => {
  if (selectedTab === "replies") {
    loadReplies();
  } else {
    loadPosts();
  }
});

function loadPosts() {
  $.get(
    "/api/posts",
    { postedBy: profileUserId, isReply: false },
    (results) => {
      outpustPosts(results, $(".postContainer"));
    }
  );
}

function loadReplies() {
  $.get("/api/posts", { postedBy: profileUserId, isReply: true }, (results) => {
    outpustPosts(results, $(".postContainer"));
  });
}
