const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// "DATABASES"
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "randomUserID": {
    id: "randomUserID",
    email: "test@test.com",
    password: "test"
  },
  "randomUserID2": {
    id: "randomUserID2",
    email: "test2@test.com",
    password: "test"
  }
};

// --------------------------------------------------
//generate random string for urlDatabase key names
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

const findUserEmail = function(array, email) {
  let confirmedEmail;

  for (let i = 0; i < array.length; i++) {
    // console.log(userBody[i].email);

    if (array[i].email === email) {
      confirmedEmail = array[i].email;
    }
  }
  return confirmedEmail;
};

//Update the _header partial to show the email value
//from the user object instead of the username.

app.post('/login', (req, res) => {
  const email = req.body.email;
  // console.log(" email", email);
  //need random id value from cookie to lookup email by user key
  // console.log(users.randomUserID.email);

  const userBody = Object.values(users);
  let confirmedEmail = (findUserEmail(userBody, email));
  console.log(confirmedEmail);
  // console.log("USERS",userBody);
  console.log("--------------------------");

  // res.cookie('email', email);
  res.redirect('/urls');
});



//USER LOGIN
// app.post('/login', (req, res) => {

//   const username = req.body.username;
//   console.log("USERNAME",username);
//   res.cookie('username', username);
//   res.redirect('/urls');
//   //loop through object, find email, assign related user id to cookie
// });


//USER LOGOUT
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  //call templateVars as a parameter, because it is needed by the header
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render('urls_login', templateVars);
});



app.get('/register', (req, res) => {
  //call templateVars as a parameter, because it is needed by the header
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render('urls_registration', templateVars);
});


app.post('/register', (req, res) => {
  // console.log("REQBODY",req.body);
  //get values for user id, email, password
  const email = req.body.email;
  const password = req.body.password;
  
  // console.log(res);
  if (email === "" || password === "") {
    // console.log("EMPTY");
    // console.log(res.statusCode);
    res.status(400);
    // console.log(res.statusCode);
    res.send("Error: email/password can't be blank");
  }

  //FINDUSEREMAIL TAKES IN AN ARRAY
  // console.log(email);
  const userBody = Object.values(users);
  // console.log(findUserEmail(userBody, email));
  if (email === findUserEmail(userBody,email)) {
    res.status(400);
    res.send("Error: email is taken");
  }










  //generate random id for user
  const id = generateRandomString(6, numsAndLetters);

  //add user object to global 'user' object
  users[id] = {id, email, password};
  // console.log(users);

  //set a user_id cookie with the randomly generated user id
  res.cookie("user_id", id);
  //redirect to /urls page
  res.redirect('/urls');
});


/*
Lookup the user object in the users object using the user_id cookie value
Pass this user object to your templates via templateVars.
Update the _header partial to show the email value from the user object instead of the username.
*/




app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  // console.log(req);

  //get user_id cookie value
  // console.log(req.cookies["user_id"]);
  //lookup user in global users object with user_id value
  // console.log(users[req.cookies["user_id"]]);

  //pass the templateVars object to the template called "urls_index"
  res.render("urls_index", templateVars);
});




//ORIGINAL RENDERING FOR INDEX
// app.get("/urls", (req, res) => {
//   const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
//   // console.log(req);
//   //pass the templateVars object to the template called "urls_index"
//   res.render("urls_index", templateVars);
// });

//render the form page
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };

  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL: shortURL, longURL: longURL, user: users[req.cookies["user_id"]] };
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
  const templateVars = { shortURL: shortURL, longURL: longURL, user: users[req.cookies["user_id"]] };
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


