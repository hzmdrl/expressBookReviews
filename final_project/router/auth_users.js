const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password,
        }, 'access', { expiresIn: 60 * 60});
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send(`User ${username} succesfully logged in`);
    } else {
        return res.status(208).json({ message: "Invalid login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization['username'];

    if (!username) {
        return res.status(401).send(`User not found`);
    }

    if (!books[isbn]) {
        return res.status(404).send("Book not found");
    }

    books[isbn].reviews[username] = review;

    res.send(`Review by ${username} which is ${review} added/updated successfully`);

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    const username = req.session.authorization['username'];

    if (!username) {
        return res.status(401).send(`User not found`);
    }

    if (!books[isbn]) {
        return res.status(404).send("Book not found");
    }

    const bookReviews = books[isbn].reviews[username];


    if (!bookReviews) {
        return res.status(404).send("Review not found");
        //delete books[isbn].reviews[username];
    } 

    delete books[isbn].reviews[username];
    res.send(`Review deleted by ${username} for book ISBN ${isbn} `);

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
