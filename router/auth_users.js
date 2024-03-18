const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// check if username already exists
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

// check if username is valid
const isValid = (username) => {
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,14}$/;
  return usernameRegex.test(username);
}

// check if user is authenticated or not
const authenticatedUser = (username, password) => {
  const validUser = users.filter((user) => {
    return user.username === username && user.password === password
  });
  if (validUser.length > 0) {
    return true;
  } else {
    return false;
  }

}

//only registered users can login
regd_users.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username or password is missing" });
    }

    if (!authenticatedUser(username, password)) {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
    let accessToken = jwt.sign({ username: username, password: password }, 'secretKey', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({ message: "Login Successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    console.log(req.user);
    const { review } = req.body;
    const { isbn } = req.params;
    const book = Object.values(books).find(book => book.isbn === isbn);
    if (!book) {
      return res.status(404).json({ book: null, message: "Book review not found" });
    }
    book.reviews.push({ username: req.user.username, review: review });

    return res.status(201).json({ message: "Review added successfully", book });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const { isbn } = req.params;
    const book = Object.values(books).find(book => book.isbn === isbn);
    if (!book) {
      return res.status(404).json({ book: null, message: "Book review not found" });
    }
    book.reviews = book.reviews.filter(review => review.username !== req.user.username);
    return res.status(200).json({ message: "Review deleted successfully", book });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.doesExist = doesExist;
module.exports.users = users;
