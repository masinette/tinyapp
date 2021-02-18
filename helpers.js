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

const urlsForUser = function (database, id) {
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


module.exports = { getUserIdByEmail, urlsForUser, confirmUserEmail };