const express = require("express");
const cookieSession = require('cookie-session');
// const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const { getUserIdByEmail } = require('./helpers');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());


app.use(cookieSession({
  name: 'session',
  keys: ['hbefv8g4t83btv', 'jkfbcibe8y35']
}));



// "DATABASES"
const urlDatabase = {

  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "randomUserID1" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "randomUserID2" }
};

const users = {
  "randomUserID1": {
    id: "randomUserID1",
    email: "test@test.com",
    hashedPassword: "$2b$10$IvlaFivG77HAs8L6CUHb7.ta4Mzxyxg2F/U6uBOfQHZq5Q6xrIr7i"
  },
  "randomUserID2": {
    id: "randomUserID2",
    email: "test2@test.com",
    hashedPassword: "$2b$10$3o4B8o7ykr1ChOWGWum/R.7E1p0qY4eV0bAFMiU6qXJ9dbLRFJO6e"
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




const findUserPassword = function (array, email) {
  let confirmedPassword;

  for (let i = 0; i < array.length; i++) {
    // console.log(userBody[i].email);

    if (array[i].email === email) {
      confirmedPassword = array[i].password;
    }
  }
  return confirmedPassword;
};

const findUserID = function (array, email) {
  let id;

  for (let i = 0; i < array.length; i++) {
    // console.log(userBody[i].email);
    if (array[i].email === email) {
      id = array[i].id;
    }
  }
  return id;
};

const urlsForUser = function (database, id) {
  const userURLDatabase = {};
  //loop through urlDatabase
  for (let key in database) {
    //target entries by user id
    if (database[key].userID === id) {
      // assign user specific objects to new object database
      userURLDatabase[key] = database[key];
      // console.log(userURLDatabase);
    }
  }
  //return database
  return userURLDatabase;
};
// console.log(urlsForUser(urlDatabase, "randomUserID1"));

const IDMatch = function (database, id) {
  let matchID;
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      matchID = urlDatabase[key].userID;
    }
  }
  return matchID;
};

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // const hashedPassword = bcrypt.hashSync(password, 10);
  // console.log(req.body);
  // console.log(" email", email);
  // console.log("USERS", users);
  //need random id value from cookie to lookup email by user key
  // console.log(users.randomUserID.email);

  // console.log(email,"HASHEDPW", hashedPassword);
  // console.log(bcrypt.hashSync("test", 10));
  // console.log(password);

  const userBody = Object.values(users);
  let confirmedEmail = (findUserEmail(userBody, email));
  // let confirmedPassword = (findUserPassword(userBody, email));

  console.log("--------------------------");

  // const id = findUserID(userBody, email);
  const id = getUserIdByEmail(users, email);


  if (confirmedEmail) {
    if (bcrypt.compareSync(password, users[id].hashedPassword)) {
      // if (confirmedPassword === password) {
      // if email and password match, set user id cookie to one in database
      // res.cookie('user_id', id);
      req.session["user_id"] = id;
    } else {
      //if email matches but password doesnt, 403
      res.status(403).send("Error 403: password is incorrect");
    }
    //if email cannot be found return response of 403 status code
  } else {
    res.status(403).send("Error 403: email is not registered");
  }


  res.redirect('/urls');
});

//USER LOGOUT
app.post('/logout', (req, res) => {
  req.session["user_id"] = null;
  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  //call templateVars as a parameter, because it is needed by the header
  const templateVars = { user: users[req.session["user_id"]] };
  res.render('urls_login', templateVars);
});



app.get('/register', (req, res) => {
  //call templateVars as a parameter, because it is needed by the header
  const templateVars = { user: users[req.session["user_id"]] };
  res.render('urls_registration', templateVars);
});


app.post('/register', (req, res) => {
  // console.log("REQBODY",req.body);
  //get values for user id, email, password
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);


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
  if (email === findUserEmail(userBody, email)) {
    res.status(400);
    res.send("Error: email is taken");
  }
  //generate random id for user
  const id = generateRandomString(6, numsAndLetters);

  //add user object to global 'user' object
  users[id] = { id, email, hashedPassword };
  // console.log(users);

  //set a user_id cookie with the randomly generated user id
  req.session["user_id"] = id;
  // res.cookie("user_id", id);
  //redirect to /urls page
  res.redirect('/urls');
});


/*
Lookup the user object in the users object using the user_id cookie value
Pass this user object to your templates via templateVars.
Update the _header partial to show the email value from the user object instead of the username.
*/
app.get("/urls", (req, res) => {
  const userId = req.session["user_id"];
  const userDatabase = urlsForUser(urlDatabase, userId);
  //only pass user specific database to template
  const templateVars = { urls: userDatabase, user: users[req.session["user_id"]] };
  // console.log(req);

  //if use is logged in , show the index page
  if (req.session["user_id"]) {
    res.render("urls_index", templateVars);
  } else {
    res.send("Please register (or login) first");
  }

  //pass the templateVars object to the template called "urls_index"
});


//render the form page
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.session["user_id"]] };

  //If someone is not logged in when trying to access /urls/new,
  //redirect them to the login page.
  if (req.session["user_id"]) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }

});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL].longURL, user: users[req.session["user_id"]] };
  const id = req.session["user_id"];



  // console.log(shortURL);

  // console.log(urlDatabase[shortURL].userID);

  // if (req.cookies["user_id"]) {
  if (id && (urlDatabase[shortURL].userID === id)) {
    res.render("urls_show", templateVars);
  } else {
    res.send("Please register (or login) to see your list");
  }
});

//match the POST request on urls_new and handle it,
//log the POST request body to the console, and respond (with OK)
app.post("/urls", (req, res) => {
  // console.log("REQ.BODY",req.body);
  const shortURL = generateRandomString(6, numsAndLetters);
  // const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session["user_id"] };

  const longURL = urlDatabase[shortURL].longURL;

  const templateVars = { urls: urlDatabase, shortURL: shortURL, longURL: longURL, user: users[req.session["user_id"]] };
  // urlDatabase[shortURL] = longURL;
  // res.send("Ok");
  res.render("urls_show", templateVars);
});

//redirect to long url
app.get("/u/:shortURL", (req, res) => {
  //get shortURL from request parameters
  // const urls = Object.keys(urlDatabase);
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
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
  const shortURL = req.params.shortURL;

  // console.log(urlDatabase[shortURL].userID);

  //only delete if owner is logged in, and id matches url
  if ((req.session["user_id"]) && (req.session["user_id"] === urlDatabase[shortURL].userID)) {
    delete urlDatabase[req.params.shortURL];

  } else {
    res.send("Please register (or login) first");
  }

  res.redirect('/urls');
});


//update URL resource in urlDatabase, when update button is pushed on urls_show,
//use user input to update database with new longURL
app.post('/urls/:shortURL', (req, res) => {
  // console.log("REQ.BODY",req.body.update);
  //get the current shortURL
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  // console.log(shortURL);
  // console.log(longURL);
  // console.log("SHORTURL", shortURL);
  //use the shortURL to access urlDatabase, and redefine value of shortURL


  //only logged in, correct user can make edits to urls
  if ((req.session["user_id"]) && (req.session["user_id"] === urlDatabase[shortURL].userID)) {
    urlDatabase[shortURL].longURL = req.body.update;
  } else {
    res.send("Please register (or login) first");
  }
  //go back to updated list of URLS
  res.redirect('/urls');
});
