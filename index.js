var express = require("express");
var app = express();
var fs = require('fs');
var Papa = require('papaparse');
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var api = require('./tweet_api/api');

//
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    key: 'user_sid',
    secret: "cmpe_280_secure_string",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 6000000
    }
  })
);

//Only user allowed is admin
var Users = [
  {
    username: "admin",
    password: "admin"
  }
];

var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user) {
      res.redirect('/home');
  } else {
      next();
  }    
};
var worldCities;
var content = fs.readFileSync("worldcities.csv", "utf8");
var loadWorldCities = function() {
  Papa.parse(content, {
    header: false,
    complete: function(results) {
      worldCities = results.data;
      worldCities = worldCities.map(element => ({city: element[0], latitude : element[2], longitude : element[3], country: element[4]}))
      console.log("CSV Loaded")
    }
  })
};

app.get("/", sessionChecker, function (req, res) {
    //check if user session exits
    if(worldCities){
    } else {
      loadWorldCities();     
    }
    res.redirect("/login");
});

app.route('/login')
  .get(sessionChecker, (req, res) => {
      res.render("login", {error: "", dynamicLoad: "Login"});
  })
  .post((req, res) => {
    var username = req.body.username,
        password = req.body.password;
    api.getUser(username, password, req, res);
    
    // var found = Users.find(element => element.username == username);
    // if (typeof found !=  "undefined") {
    //   if (found.password == password) {
    //     req.session.user = found; 
    //     res.cookie('user', 'user');
    //     res.redirect('/home');
    //   } else {
    //     res.render("login", {error: "Username or Password is incorrect", dynamicLoad: "Login"})
    //   }
    // } else {
    //   res.render("login", {error: "Username or Password is incorrect", dynamicLoad: "Login"})
    // }
});

app.get('/home', (req, res) => {
  if (req.session.user && req.cookies.user) {
    // api.get_trends(req, res); 
    res.render("home"); 
  } else {
      res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user) {
      res.clearCookie('user_sid');
      res.redirect('/');
  } else {
      res.redirect('/login');
  }
});

app.get('/signup', (req, res) => {
  return res.render('login', {error: "", dynamicLoad: "Sign Up"});
});

app.post('/signup', (req, res) => {
  // var found = Users.find(element => element.username == req.body.username);
  // if (typeof found == "undefined") {
    //   if (store == "stored") {
    //     console.log("stored")
    //     res.redirect("/login");
    //   } else {
    //     return "error"
    //   }
    // })
    // console.log(store)
    
  //   Users.push({
  //     username: req.body.username,
  //     password: req.body.password
  //   });
  //   res.redirect("/login");
  // } else {
  //   return res.render('login', {error: "Usernaeme already exists", dynamicLoad: "Sign Up"});
  // }
  
  api.storeUser(req.body.username, req.body.password, req, res)

});

//get from database
app.get('/fetchtweets/:query', function(req, res) {
  api.get_request(req,res);
 
})

//delete from database
app.post('/deletetweets/:query', function(req, res){
  api.delete_request(req,res);
 
})

//add to database
app.post('/tweets', (req, res) => {
  api.post_request(req,res);
  
});

app.get('/analysis/:query', (req,res) =>{
  // console.log("api " + worldCities)
  api.analysis(req, res, worldCities);
});

app.get('/trends/:place?', (req,res) =>{
  api.get_trends(req,res);
});

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});

var server = app.listen(3000, function () {
  console.log("Server listening on port 3000");
}); 
