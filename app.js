const express = require("express");
const app = express();
const port = 3005;
const middleware = require("./middleware");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("./database");
const session = require('express-session')


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


// Api routes
const postsApiRoute = require("./routes/api/posts");
const usersApiRoute = require("./routes/api/users");

app.use("/login", loginRoutes);
app.use("/register", registerRoute);
app.use("/logout", logoutRoutes);
app.use("/posts",middleware.requireLogin, postRoutes);
app.use("/profile", middleware.requireLogin, profileRoutes);
app.use("/uploads", uploadRoutes);
app.use("/search",middleware.requireLogin, searchRoutes);


app.use("/api/posts", postsApiRoute);
app.use("/api/users", usersApiRoute);


app.get("/", middleware.requireLogin, (req, res, next) => {
  var payload = {
    pageTitle: "Home",
    userLoggedIn: req.session.user,
    userLoggedInJs:JSON.stringify(req.session.user)
  };

  res.status(200).render("home", payload);
});

const server = app.listen(port, () =>
  console.log("Server is listening on port " + port)
);
