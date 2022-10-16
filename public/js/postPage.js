$(document).ready(() => {
    $.get("/api/posts/" + postId,results => {
    // console.log(results)
        outpustPostsWithReplies(results,$(".postContainer"))
  });
})

