const express = require('express');
let axios = require("axios");
let books = require("./booksdb.js");
let doesExist = require('./auth_users.js').doesExist;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// register a new user
public_users.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username or password is missing" });
    }
    if (!isValid(username)) {
      return res.status(400).json({ message: "Invalid username" });
    }
    if (doesExist(username)) {
      return res.status(400).json({ message: "User already exists" });
    }

    users.push({ "username": username, "password": password });

    return res.status(200).json({ message: "User successfully registered. You can login now." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    return res.status(200).json({ books: JSON.stringify(books) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


// Get the book list using Promise callbacks or async-await with Axios is covered
public_users.get("/books", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000");
    const data = response.data;
    const books = JSON.parse(data.books);
    return res.status(200).json({ books: JSON.stringify(books) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(book => book.isbn === isbn);
    if (!book) {
      return res.status(404).json({ book: null, message: "Book not found" });
    }
    return res.status(200).json({ book: JSON.stringify(book) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  try {
    const author = req.params.author;
    const book = Object.values(books).find(book => book.author.toLowerCase() === author.toLowerCase());
    if (!book) {
      return res.status(404).json({ book: null, message: "Book not found" });
    }
    return res.status(200).json({ book: JSON.stringify(book) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

});

// Get book details based on author  using Promise callbacks or async-await with Axios is covered
public_users.get("/books/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    const data = response.data;
    const book = JSON.parse(data.book);
    return res.status(200).json({ book: JSON.stringify(book) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  try {
    const title = req.params.title;
    const book = Object.values(books).find(book => book.title.toLowerCase() === title.toLowerCase());
    if (!book) {
      return res.status(404).json({ book: null, message: "Book not found" });
    }
    return res.status(200).json({ book: JSON.stringify(book) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get book details based on title using Promise callbacks or async-await with Axios is covered
public_users.get("/books/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    const data = response.data;
    const book = JSON.parse(data.book);
    return res.status(200).json({ book: JSON.stringify(book) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(book => book.isbn === isbn);
    if (!book) {
      return res.status(404).json({ book: null, message: "Book review not found" });
    }
    const book_reviews = book.reviews;
    const book_isbn = book.isbn;
    return res.status(200).json({ reviews: JSON.stringify(book_reviews), isbn: book_isbn });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports.general = public_users;
