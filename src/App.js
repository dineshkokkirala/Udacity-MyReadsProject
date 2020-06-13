import React from "react";
import "./App.css";
import Home from "./pages/Home";
import Search from "./pages/Search";
import * as BooksAPI from "./BooksAPI";
import { BrowserRouter, Switch, Route } from "react-router-dom";

class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
    };
  }

  async getListOfBooks() {
    const books = await BooksAPI.getAll();
    this.setState({
      books,
    });
  }

  async componentDidMount() {
    await this.getListOfBooks();
  }

  async addBook(book) {
    const newBook = await BooksAPI.get(book.id);
    return newBook;
  }

  renderBook = (book, Nameofpage = "HOME") => {
    return (
      <li key={book.id}>
        <div className="book">
          <div className="book-top">
            <div
              className="book-cover"
              style={{
                width: 128,
                height: 193,
                backgroundImage: `url(${
                  book.imageLinks ? book.imageLinks.smallThumbnail : ""
                })`,
              }}
            ></div>
            <div className="book-shelf-changer">
              <select
                onChange={(e) => this.changeBookShelf(e, book, Nameofpage)}
                value={this.gBook(book)}
              >
                <option value="move" disabled>
                  Move to...
                </option>
                <option
                  value="currentlyReading"
                  disabled={book.shelf === "currentlyReading"}
                >
                  Currently Reading
                </option>
                <option
                  value="wantToRead"
                  disabled={book.shelf === "wantToRead"}
                >
                  Want to Read
                </option>
                <option value="read" disabled={book.shelf === "read"}>
                  Read
                </option>
                <option
                  value="none"
                  disabled={!book.shelf || book.shelf === ""}
                >
                  None
                </option>
              </select>
            </div>
          </div>
          <div className="book-title">{book.title}</div>
          <div className="book-authors">
            {book.authors && book.authors.join(", ")}
          </div>
        </div>
      </li>
    );
  };

  async changeBookShelf(e, book, Nameofpage) {
    const updatedList = await BooksAPI.update(book, e.target.value);
    this.update(book, updatedList, Nameofpage);
  }

  update = async (BookUpdated, updatedList, Nameofpage) => {
    let { books } = this.state;
    let isNotUpdate = true;
    books = books.map((book) => {
      if (book.id === BookUpdated.id) {
        Object.keys(updatedList).forEach((shelfName) => {
          if (updatedList[shelfName].includes(book.id)) {
            book.shelf = shelfName;
            isNotUpdate = false;
          }
        });
      }
      return book;
    });

    if (isNotUpdate) {
      if (Nameofpage === "HOME") {
        books = books.filter((item) => item.id !== BookUpdated.id);
      } else {
        const newBook = await this.addBook(BookUpdated);
        books.push(newBook);
      }
    }

    this.setState({
      books,
    });
  };

  gBook(cbook) {
    const { books } = this.state;
    let bookShelf = "none";
    books.forEach((book) => {
      if (cbook.id === book.id) {
        bookShelf = book.shelf;
      }
    });
    return bookShelf;
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/search">
            <Search renderBook={this.renderBook} />
          </Route>
          <Route path="/">
            <Home books={this.state.books} renderBook={this.renderBook} />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default BooksApp;
