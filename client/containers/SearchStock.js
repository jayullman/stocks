import React, { Component } from 'react';

import axios from 'axios';
import checkSymbol from 'check-ticker-symbol';

class SearchStock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchField: ''
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
      });
    }
  }

  render() {
    return (
      <div>
        <form>
          <input 
            onChange={this.handleSearchFieldChange}
            type='text' 
          />
          <button 
            onClick={this.handleAdd}
          >
            Add Stock
          </button>
        </form>
      </div>
    );
  }
}

export default SearchStock;
