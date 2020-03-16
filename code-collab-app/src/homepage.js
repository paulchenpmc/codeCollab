import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Main page
        </p>
        <Link to="/editor">
          <button variant="outlined">
            Editor
          </button>
        </Link>
      </header>
    </div>
  );
}

export default Homepage;
