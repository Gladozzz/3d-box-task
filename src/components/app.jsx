import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './App.css';
import Threejsview from './threejsview';

const propTypes = {
  // initialName: PropTypes.string
};

const defaultProps = {
  // initialName: 'Аноним'
};

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='App'>
        <Threejsview/>
      </div>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;