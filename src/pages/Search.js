import React from "react";
import * as BooksAPI from "../BooksAPI";
import { withRouter } from "react-router";

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: [],
    };
  }

  renderresults() {
    const { result } = this.state;
    return result.map((book) => this.props.renderBook(book, "SEARCH"));
  }

  async getBooks(e) {
    if (e.target.value) {
      let result = await BooksAPI.search(e.target.value);
      if (result.error) {
        result = [];
      }
      this.setState({
        result,
      });
    } else {
      this.setState({
        result: [],
      });
    }
  }

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <button
            className="close-search"
            onClick={() => this.props.history.push("/")}
          >
            Close
          </button>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              autoFocus={true}
              onChange={(e) => this.getBooks(e)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">{this.renderresults()}</ol>
        </div>
      </div>
    );
  }
}

export default withRouter(Search);
