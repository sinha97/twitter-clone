$(document).ready(() => {
    $.get("/api/posts",results => {
    // console.log(results)
        outpustPosts(results,$(".postContainer"))
  });
})

