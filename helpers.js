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

console.log(getUserIdByEmail(users, "test@test.com"));

module.exports = { getUserIdByEmail };