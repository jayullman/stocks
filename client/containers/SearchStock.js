import React, { Component } from 'react';

import axios from 'axios';
import checkSymbol from 'check-ticker-symbol';

import '../styles/searchStock.css';

class SearchStock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchField: '',
      messageText: ''
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.validateSymbol = this.validateSymbol.bind(this);
    this.handleSearchFieldChange = this.handleSearchFieldChange.bind(this);
  }

  handleSearchFieldChange(event) {
    const value = event.target.value;
    this.setState({
      searchField: value
    });
  }

  // validates whether the symbol user entered is valid
  validateSymbol(symbol) {
    return checkSymbol.valid(symbol);
  }

  handleAdd(event) {
    event.preventDefault();
    const symbol = this.state.searchField;

    // validate stock symobol
    if (this.validateSymbol(symbol)) {
      axios.post('/addStock', {
        symbol
      })
        .then(({ data }) => {
          if (data.error) {
            this.setState({
              messageText: data.error
            });
          } else {
            this.setState({
              messageText: ''
            });
          }
        });
    } else {
      this.setState({
        messageText: 'The stock symbol you entered was not valid'
      });
    }
  }

  render() {
    return (
      <div>
        <form>
          <div className='intro'>
            <p>
              This app uses socket.io to maintain continuous communication with the server. A change 
              from one user will be reflected instantly across all users. Use the form below to add
              a stock to track. Click on the <i className="fa fa-times-circle" aria-hidden="true" /> to 
              remove a stock.
            </p>
          </div>
          <input 
            onChange={this.handleSearchFieldChange}
            type='text'
            placeholder='Symbol' 
          />
          <button 
            onClick={this.handleAdd}
          >
            Add Stock
          </button>
        </form>
        <div
          className='message-area'
        >
          {this.state.messageText}
        </div>
      </div>
    );
  }
}

export default SearchStock;
