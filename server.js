const express = require('express');
const mustacheExpress = require('mustache-express')
const bodyParcer = require('body-parser');
const session = require('express-session');
const sessionConfig = ('./sessionConfig');
const app = express();
const port = process.env.port || 8000;

// SET VIEW ENGINE
app.engine('mustache', mustacheExpress());
app.set('views', './public');
app.set('view engine', 'mustache');


// MIDDLEWARE



// ROUTES
app.get('/', function(req, res) {
  res.render('index');
});


app.post('/login', function(req, res) {
  res.render('login');
});



app.listen(port, function(){
  console.log('Server is up and running on port', port);
});