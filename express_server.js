const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

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


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
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
  const templateVars = { shortURL: shortURL, longURL: longURL };
  res.render("urls_show", templateVars);
});

//match the POST request on urls_new and handle it,
//log the POST request body to the console, and respond (with OK)
app.post("/urls", (req, res) => {
  console.log("REQ.BODY",req.body);
  const shortURL = generateRandomString(6, numsAndLetters);
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  // res.send("Ok");
  const templateVars = { shortURL: shortURL, longURL: longURL };
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




// let result = generateRandomString(6, numsAndLetters);
// urlDatabase.result = `http://localhost:8080/urls/${result}`;