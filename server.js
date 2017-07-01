const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const sessionConfig = require("./sessionConfig");
const app = express();
const port = process.env.port || 3003;

var users = [{ username: "rick", password: "iron" }];

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


app.get("/logout", function(req, res) {
  res.render('login');
});

app.post("/", function(req, res) {
  // if (req.body.logout == "logout") {
    req.session.destroy();
     console.log('LOGOUT');
    res.redirect("/login");
  // }
});


app.post("/login", function(req, res) {
  console.log('4444');
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

app.listen(port, function() {
  console.log("Server is up and running on port", port);
});
