const { assert } = require('chai');
const { getUserIdByEmail, urlsForUser, confirmUserEmail } = require('../helpers.js');


const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserIdByEmail(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    assert(user, expectedOutput);
  });
  it('should return undefined, as user is not in database', function() {
    const user = getUserIdByEmail(testUsers, "user@notarealcompany.com");
    const expectedOutput = 'undefined';
    assert(typeof user === 'undefined', typeof expectedOutput === 'undefined');
  });
});

describe('urlsForUser', function() {
  it('should return array with only urls that belong to user', function() {
    const user = urlsForUser(testUsers, "userRandomID");
    const expectedOutput = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    };
    assert(user, expectedOutput);
  });
  it('should return empty object if user does not have urls in database', function() {
    const user = urlsForUser(testUsers, "userRandomID3");
    const expectedOutput = {};
    assert(user, typeof expectedOutput);
  });
});

describe('confirmUserEmail', function() {
  it('should return email if user inputted email matches an email in the database', function() {
    const email = confirmUserEmail(testUsers, "user@example.com");
    const expectedOutput = "user@example.com";
    assert(email, expectedOutput);
  });
  it('should return undefined if users email is not in database', function() {
    const email = confirmUserEmail(testUsers, "user@nothanks.com");
    const expectedOutput = 'undefined';
    assert(typeof email === 'undefined', typeof expectedOutput === 'undefined');
  });
});

