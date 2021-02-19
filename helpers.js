const getUserIdByEmail = function(users, emailAccount) {
  let confirmedUser;
  for (let user in users) {
    let usersEmail = users[user].email;

    if (usersEmail === emailAccount) {
      confirmedUser = users[user].id;
    }
  }
  return confirmedUser;
};

const urlsForUser = function(database, id) {
  const userURLDatabase = {};
  for (let key in database) {
    //target entries by user id
    if (database[key].userID === id) {
      // assign user specific objects to new object database
      userURLDatabase[key] = database[key];
    }
  }
  //return database
  return userURLDatabase;
};

const confirmUserEmail = function(users, emailAccount) {
  let confirmedEmail;

  for (let user in users) {
    let usersEmail = users[user].email;

    if (usersEmail === emailAccount) {
      confirmedEmail = users[user].email;
    }
  }
  return confirmedEmail;
};

//generate random string for key names
const generateRandomString = function(lengthOfString) {
  let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomAlphaNum = '';
  let randomString = '';

  for (let i = 0; i < lengthOfString; i++) {
    randomAlphaNum = (characters[(Math.floor(Math.random() * characters.length))]);
    randomString += randomAlphaNum;
  }
  return randomString;
};

module.exports = { getUserIdByEmail, urlsForUser, confirmUserEmail, generateRandomString };