import React, { Component } from 'react';

import axios from 'axios';

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

  validateSymbol(symbol) {
    return true;
  }

  handleAdd(event) {
    event.preventDefault();
    // validate stock symobol
    console.log(this.state.searchField);
    // socket.emit('button', this.state.searchField);
    axios.post('/addStock', {
      symbol: this.state.searchField
    });
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
