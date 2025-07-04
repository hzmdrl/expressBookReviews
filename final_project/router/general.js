const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: `User ${username} successfully registered. Now you can login.`});
        } else {
            return res.status(404).json({message: `User ${username} already exists!`});
        }
    }
    return res.status(404).json({message: "Unable to register user"});

});

const doesExist = (userName) => {
    let userswithsamename = users.filter((user) => {
        return user.username === userName;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // send JSON response with formatted book data
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const matchedBooks = [];

    const keys = Object.keys(books);

    for (const key of keys) {
        const book = books[key];
        if (book.author === author) {
            matchedBooks.push(book);
        }
    }

    if (matchedBooks.length > 0) {
        res.send(JSON.stringify(matchedBooks,null,4));
    } else {
        res.status(404).send("No books found by that author");
    }


});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    const title = req.params.title;
    const matchedBooks = [];

    const keys = Object.keys(books);

    for (const key of keys) {
        const book = books[key];
        if (book.title === title) {
            matchedBooks.push(book);
        }
    }

    if (matchedBooks.length > 0) {
        res.send(JSON.stringify(matchedBooks,null,4));
    } else {
        res.status(404).send("No books found by that author");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
