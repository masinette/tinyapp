const express = require("express");
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const { getUserIdByEmail, urlsForUser, confirmUserEmail, generateRandomString } = require('./helpers');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['hbefv8g4t83btv', 'jkfbcibe8y35']
}));


//------------------------------  "DATABASES"  -------------------------------------------//
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


//-------------------------------   ROUTES   ----------------------------------------------//
app.get("/", (req, res) => {
  //if user is logged in, redirect to urls page
  if (req.session["user_id"]) {
    res.redirect('/urls');
  } else {
    //if user is not logged in, redirect to login page
    res.redirect('/login');
  }
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  //tester page, fun little message for whomever is looking
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//LOGIN AND LOGOUT
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  //validate user inputted email against users database
  let confirmedEmail = (confirmUserEmail(users, email));
  const id = getUserIdByEmail(users, email);

  //if email is in database, compare hashed password
  if (confirmedEmail) {
    if (bcrypt.compareSync(password, users[id].hashedPassword)) {
      //if passwords match, create cookie for user
      req.session["user_id"] = id;
    } else {
      //if email matches but password doesn't, 403 status code
      res.status(403).send("Error 403: password is incorrect");
    }
    //if email cannot be found return response of 403 status code
  } else {
    res.status(403).send("Error 403: please enter registered email");
  }
  //redirect user to urls main page, once logged in
  res.redirect('/urls');
});
app.post('/logout', (req, res) => {
  //USER LOGOUT, clear cookie, then redirect to urls
  req.session["user_id"] = null;
  res.redirect('/urls');
});
app.get('/login', (req, res) => {
  //call templateVars as a parameter, because it is needed by the header
  const templateVars = { user: users[req.session["user_id"]] };
  //render login form page
  res.render('urls_login', templateVars);
});

//REGISTRATION
app.get('/register', (req, res) => {
  //call templateVars as a parameter, because it is needed by the header
  const templateVars = { user: users[req.session["user_id"]] };
  //render registration form page
  res.render('urls_registration', templateVars);
});
app.post('/register', (req, res) => {
  //get values for user id, email, password
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  //if password or email are blank, send error message
  if (email === "" || password === "") {
    res.status(400).send("Error: email/password can't be blank");
  }
  //if email is already in database, send error message
  if (email === confirmUserEmail(users, email)) {
    res.status(400).send("Error: email is taken");
  }
  //generate random id for user
  const id = generateRandomString(6);

  //add user object to global 'users' object
  users[id] = { id, email, hashedPassword };

  //set a user_id cookie with the randomly generated user id
  req.session["user_id"] = id;
  //redirect to /urls page
  res.redirect('/urls');
});


//URLS, INDEX
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.session["user_id"]] };
  //if user logged in render urls_new page
  if (req.session["user_id"]) {
    res.render("urls_new", templateVars);
  } else {
    //If someone is not logged in when trying to access /urls/new,
    //redirect them to the login page.
    res.redirect("/login");
  }

});
app.get("/urls", (req, res) => {
  /*
  Lookup the user object in the users object using the user_id cookie value
  Pass this user object to templates via templateVars.
  Update the _header partial to show the email value from the user object instead of the username.
  */
  const userId = req.session["user_id"];
  const userDatabase = urlsForUser(urlDatabase, userId);
  //only pass user specific database to template
  const templateVars = { urls: userDatabase, user: users[req.session["user_id"]] };

  //if user is logged in , show the index page
  if (req.session["user_id"]) {
    res.render("urls_index", templateVars);
  } else {
    //if user isn't logged in, send message to tell them to login
    res.send("Please register (or login) first");
  }
});
app.post("/urls", (req, res) => {
  //genertae random id/shorturl
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session["user_id"] };
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { urls: urlDatabase, shortURL: shortURL, longURL: longURL, user: users[req.session["user_id"]] };
  //render urls_show page
  res.render("urls_show", templateVars);
});

// ID/ SHORTURL
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL].longURL, user: users[req.session["user_id"]] };
  const id = req.session["user_id"];

  //if current user_id is in database, render user specific urls_show page with their own urls list
  if (id && (urlDatabase[shortURL].userID === id)) {
    res.render("urls_show", templateVars);
  } else {
    //if user is not logged in, or not in database, send error message
    res.send("Please register (or login) to see your list");
  }
});
app.get("/u/:shortURL", (req, res) => {
  //redirect to long url
  //get shortURL from request parameters
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  //render longURL webpage
  res.redirect(longURL);
});
app.post('/urls/:shortURL/delete', (req, res) => {
  //when user pushes delete button (wrapped in POST form), pass in the id(shortURL),
  //find that key name in the urlDatabase, and delete it. Afterward, redirect to urls
  //page with updated URL list
  const shortURL = req.params.shortURL;
  //only delete if owner is logged in, and id matches url
  if ((req.session["user_id"]) && (req.session["user_id"] === urlDatabase[shortURL].userID)) {
    delete urlDatabase[req.params.shortURL];
  } else {
    res.send("Please register (or login) first");
  }
  res.redirect('/urls');
});
app.post('/urls/:shortURL', (req, res) => {
  //update URL resource in urlDatabase, when update button is pushed on urls_show,
  //get the current shortURL
  const shortURL = req.params.shortURL;
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

//SERVER INITIATION
app.listen(PORT, () => {
  //have the server listen for incoming requests
  console.log(`Example app listening on port ${PORT}!`);
});