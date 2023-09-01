require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

//DATABASE
const database = require("./database");

//initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json()); // added this for extra security as this converts into json format.

mongoose.connect(process.env.MONGO_URL).then(() => console.log("connection established"));

// ------------ GET --------------

/*
Route                    /
Description            get all the books
Access                 Public
Parameter              None
Methods                Get
*/ 

booky.get("/" , (req,res) =>{
    return res.json({books: database.books})
});

/*
Route                    /is
Description            get specific book in ISBN
Access                 Public
Parameter              isbn
Methods                Get
*/ 

booky.get("/is/:isbn" , (req,res) => {
    const getSpecificBook = database.books.filter((book) => book.ISBN === req.params.isbn);

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
    }

    return res.json({book : getSpecificBook});
});

/*
Route                    /c
Description            get specific book in category
Access                 Public
Parameter              category
Methods                Get
*/ 

booky.get("/c/:category" , (req,res) => {
    const getSpecificBook = database.books.filter((book) => book.category.includes(req.params.category));

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the category of ${req.params.category}`});
    }

    return res.json({book : getSpecificBook});
});

/*
Route                    /l
Description            get specific book in language
Access                 Public
Parameter              language
Methods                Get
*/ 

booky.get("/l/:language" , (req,res) => {
    const getSpecificBook = database.books.filter((book) => book.language === req.params.language);

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the ISBN of ${req.params.language}`});
    }

    return res.json({book : getSpecificBook});
});

/*
Route                    /author
Description            get all author
Access                 Public
Parameter              none
Methods                Get
*/ 

booky.get("/author" , (req,res) =>{
    return res.json({authors: database.author})
});

/*
Route                    /author
Description            get the specific author
Access                 Public
Parameter              id
Methods                Get
*/ 
booky.get("/author/:id" , (req,res) => {
    const getSpecificAuthor = database.author.filter((author) => author.id === parseInt(req.params.id));

    if(getSpecificAuthor.length === 0){
        return res.json({error: `No author found for the id of ${req.params.id}`});
    }

    return res.json({book : getSpecificAuthor});
});

/*
Route                    /author/book
Description            get all author based on book
Access                 Public
Parameter              isbn
Methods                Get
*/ 

booky.get("/author/book/:isbn" , (req,res) => {
    const getSpecificAuthor = database.author.filter((author) => author.books.includes(req.params.isbn));

    if(getSpecificAuthor.length === 0){
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
    }

    return res.json({book : getSpecificAuthor});
});

/*
Route                    /publication
Description            get all the publications
Access                 Public
Parameter              none
Methods                Get
*/ 

booky.get("/publication" , (req,res) =>{
    return res.json({books: database.publication});
});

/*
Route                    /publication
Description            get specific publications
Access                 Public
Parameter              id
Methods                Get
*/ 

booky.get("/publication/:id" , (req,res) => {
    const getSpecificPublication = database.publication.filter((publication) => publication.id === parseInt(req.params.id));

    if(getSpecificPublication.length === 0){
        return res.json({error: `No author found for the id of ${req.params.id}`});
    }

    return res.json({book : getSpecificPublication});
});



/*
Route                    /publication
Description            get specific publications based on books
Access                 Public
Parameter              none
Methods                Get
*/ 

booky.get("/publication/book/:isbn" , (req,res) => {
    const getSpecificPublication = database.publication.filter((publication) => publication.books.includes(req.params.isbn));

    if(getSpecificPublication.length === 0){
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
    }

    return res.json({book : getSpecificPublication});
});

// -------------- POST -------------------

/*
Route                    /book/new
Description            Add new Book
Access                 Public
Parameter              none
Methods                post
*/ 
//this will push aur request into the database.

booky.post("/book/new" , (req,res) => {
    const newBook = req.body; // body here is the body of aur request
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
});

/*
Route                    /author/new
Description            Add new author
Access                 Public
Parameter              none
Methods                post
*/ 

booky.post("/author/new" , (req ,res) => {
    const newAuthor = req.body; 
    database.author.push(newAuthor);
    return res.json( database.author);
});

/*
Route                    /publication/new
Description            Add new publication
Access                 Public
Parameter              none
Methods                post
*/ 

booky.post("/publication/new" , (req ,res) => {
    const newPublication = req.body; 
    database.publication.push(newPublication);
    return res.json( database.publication);
});

// -------------- PUT -------------------

/*
Route                  /publication/update/book/:isbn
Description            Add new publication
Access                 Public
Parameter              isbn
Methods                put
*/ 

booky.put("/publication/update/book/:isbn" , (req,res) => {

    //updating the publication database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);  
        }
    });

    //update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });

    return res.json(
        {
            books : database.books,
            publication : database.publication,
            message : "Successfully updated publication"
        }
    );
});

// ----------- DELETE -----------------

/*
Route                  /book/delete/:isbn
Description            delete a book
Access                 Public
Parameter              isbn
Methods                delete
*/ 

booky.delete("/book/delete/:isbn" , (req, res) => {
    //which ever book that does not match with the isbn , just send it to an updatedBookDatabase array and rest will be filtered out.
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )
    database.books = updatedBookDatabase;

    return res.json({books: database.books});
});

/*
Route                  /author/delete/:id
Description            delete a author
Access                 Public
Parameter              id
Methods                delete
*/ 

booky.delete("/author/delete/:id" , (req, res) => {

    const updatedAuthorDatabase = database.author.filter(
        (authors) => authors.id !== parseInt(req.params.id)
    )
    database.author = updatedAuthorDatabase;

    return res.json({authors: database.author});
});

/*
Route                  /book/delete/author/:isbn/:authorId
Description            delete an author from a book and vice versa
Access                 Public
Parameter              isbn , authorId
Methods                delete
*/ 

booky.delete("/book/delete/author/:isbn/:authorId" , (req,res) => {
    //update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });

    //update  the author database
    database.author.forEach((eachAuthor) =>{
        if(eachAuthor.id === parseInt(req.params.authorId)){
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    });

    return res.json({
        book: database.books,
        author: database.author,
        message: "Author was deleted"
    })
});


booky.listen(3000 , () => {
    console.log("Server is up and running");
});