const express = require("express");
const app = express();
const port = 3005;
const middleware = require("./middleware");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("./database");
const session = require('express-session')

const server = app.listen(port, () =>
  console.log("Server is listening on port " + port)
);

const io = require("socket.io")(server, { pingTimeout: 60000 });

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: "you are loggedin",
  resave: true,
  saveUninitialized:false
}))

// routes
const loginRoutes = require("./routes/loginRoutes");
const registerRoute = require("./routes/registerRoutes");
const logoutRoutes = require("./routes/logout");
const postRoutes = require('./routes/postRoutes')
const profileRoutes = require('./routes/profileRoutes')
const uploadRoutes = require('./routes/uploadRoutes');
const searchRoutes = require('./routes/searchRoutes');
const mesageRoutes = require('./routes/messagesRoutes');
const notificationsRoutes = require('./routes/notificationRoutes');


// Api routes
const postsApiRoute = require("./routes/api/posts");
const usersApiRoute = require("./routes/api/users");
const chatsApiRoute = require("./routes/api/chats");
const messagesApiRoute = require("./routes/api/messages");
const notificatiosApiRoute = require("./routes/api/notifications");


app.use("/login", loginRoutes);
app.use("/register", registerRoute);
app.use("/logout", logoutRoutes);
app.use("/posts",middleware.requireLogin, postRoutes);
app.use("/profile", middleware.requireLogin, profileRoutes);
app.use("/uploads", uploadRoutes);
app.use("/search", middleware.requireLogin, searchRoutes);
app.use("/messages",middleware.requireLogin, mesageRoutes);
app.use("/notifications",middleware.requireLogin, notificationsRoutes);


app.use("/api/posts", postsApiRoute);
app.use("/api/users", usersApiRoute);
app.use("/api/chats", chatsApiRoute);
app.use("/api/messages", messagesApiRoute);
app.use("/api/notifications", notificatiosApiRoute);


app.get("/", middleware.requireLogin, (req, res, next) => {
  var payload = {
    pageTitle: "Home",
    userLoggedIn: req.session.user,
    userLoggedInJs:JSON.stringify(req.session.user)
  };

  res.status(200).render("home", payload);
});

// socket implemententation
io.on("connection", (socket) => {

  socket.on("setup", userData => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on('join room', room => socket.join(room));
  socket.on('typing', room => socket.in(room).emit('typing'));
  socket.on('stop typing', room => socket.in(room).emit('stop typing'));
  socket.on('notification received', room => socket.in(room).emit('notification received'));

  socket.on("new message", newMessage => {
    var chat = newMessage.chat;

    if (!chat.users) return console.log("chat.user not defined");

    chat.users.forEach(user => {
      if (user._id == newMessage.sender._id) return;
      socket.in(user._id).emit("message received",newMessage);
    })
  })

})

