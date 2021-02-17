const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const numsAndLetters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function generateRandomString(lengthOfString, characters) {
  let randomAlphaNum = '';
  let randomString = '';

  for (let i = 0; i < lengthOfString; i++) {
    randomAlphaNum = (characters[(Math.floor(Math.random() * characters.length))]);
    randomString += randomAlphaNum;
  };
  // console.log(randomString);
  return randomString;
};


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


//USER LOGIN
app.post('/login', (req, res) => {
  const username = req.body.username;
  // console.log("USERNAME",username);
  res.cookie('username', username);
  res.redirect('/urls');
});


//USER LOGOUT
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});





app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  // console.log(req);
  //pass the templateVars object to the template called "urls_index"
  res.render("urls_index", templateVars);
});

//render the form page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL: shortURL, longURL: longURL, username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

//match the POST request on urls_new and handle it,
//log the POST request body to the console, and respond (with OK)
app.post("/urls", (req, res) => {
  // console.log("REQ.BODY",req.body);
  const shortURL = generateRandomString(6, numsAndLetters);
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  // res.send("Ok");
  const templateVars = { shortURL: shortURL, longURL: longURL, username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

//redirect to long url
app.get("/u/:shortURL", (req, res) => {
  //get shortURL from request parameters
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});


//have the server listen for incoming requests
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//when user pushes delete button (wrapped in POST form), pass in the id(shortURL),
//find that key name in the urlDatabase, and delete it. Afterward, redirect to urls
//page with updated URL list
app.post('/urls/:shortURL/delete', (req, res) => {
  // console.log(req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});


// app.post('/urls/login', (req, res) => {
//   const username = req.body.username;
//   console.log(username);
//   res.cookie('username', username);
//   res.redirect('/urls');
// });



//update URL resource in urlDatabase, when update button is pushed on urls_show,
//use user input to update database with new longURL
app.post('/urls/:shortURL', (req, res) => {
  console.log("REQ.BODY",req.body.update);
  //get the current shortURL
  const shortURL = req.params.shortURL;
  // console.log("SHORTURL", shortURL);
  //use the shortURL to access urlDatabase, and redefine value of shortURL
  urlDatabase[shortURL] = req.body.update;
  //go back to updated list of URLS
  res.redirect('/urls');
});

// app.post('/urls/login', (req, res) => {
//   console.log("USERNAME",req.body.username);
//   // res.cookie('username');
// });