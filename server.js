const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const sessionConfig = require("./sessionConfig");
const app = express();
const port = process.env.port || 3003;

var users = [{ username: "rick", password: "iron", clicks: 0}];

// SET VIEW ENGINE
app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

// MIDDLEWARE
app.use("/", express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionConfig));
function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    next();
  }
}

// ROUTES
app.get("/", checkAuth, function(req, res) {
  res.render("index", { user: req.session.user });
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/signup", function(req, res) {
  res.render("signup");
});

app.get("/logout", function(req, res) {
  res.render('login');
});

app.post("/", function(req, res) {
    req.session.destroy();
    res.redirect("/login");
});

app.post("/login", function(req, res) {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.redirect("login");
  }

  var requestingUser = req.body;
  var userRecord;

  users.forEach(function(item) {
    if (item.username === requestingUser.username) {
      userRecord = item;
    }
  });

  if (!userRecord) {
    return res.redirect("/login");
  }

  if (requestingUser.password === userRecord.password) {
    req.session.user = userRecord;
    return res.render("index", { user: req.session.user });
  } else {
    return res.redirect("/login");
  }
});

app.post("/signup", function(req, res) {
  if (!req.body || !req.body.username || !req.body.password) {
    res.redirect("/");
  }

  var newUser = {
    username: req.body.username,
    password: req.body.password,
    clicks: 0
  }
    
  users.push(newUser);
  return res.redirect("/login");
});

app.post("/click", function(req, res) {
  var requestingUser = req.session.user
  var userRecord;
  users.forEach(function(item) {
    if (item.username === requestingUser.username) {
      userRecord = item;
      requestingUser.clicks = userRecord.clicks += 1;
    }
  });

  return res.render("index", { user: req.session.user });
});

app.listen(port, function() {
  console.log("Server is up and running on port", port);
});