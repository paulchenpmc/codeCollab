import React from 'react';
import logo from './codeCollabLogo.png';
import './App.css';
import { Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Homepage() {

  return (
    <div className="App">
      <header className="App-header">
        <span>
          <Link to='/'><img src={logo} className="App-logo" alt="logo"/></Link>{'  '}
          <Link to='/editor'><Button variant='dark'>New Document</Button></Link>{'  '}
          {/* TODO: Add upload functionality and redirect to editor page */}
          <Button variant='dark'>Upload Document</Button>
        </span>
      </header>
      <body>
        {/* TODO: Dynamically update this with active sessions */}
        <div className="container">
          <h1 className='subheading'>Active Sessions</h1>
          <div className="row">
            <div className="col-sm">
              <ListGroup.Item>Session 1</ListGroup.Item>
            </div>
            <div className="col-sm">
              <ListGroup.Item>Session 2</ListGroup.Item>
            </div>
            <div className="col-sm">
              <ListGroup.Item>Session 3</ListGroup.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-sm">
              <ListGroup.Item>Session 4</ListGroup.Item>
            </div>
            <div className="col-sm">
              <ListGroup.Item>Session 5</ListGroup.Item>
            </div>
            <div className="col-sm">
              <ListGroup.Item>Session 6</ListGroup.Item>
            </div>
          </div>
        </div>
      </body>
    </div>
  );
}

export default Homepage;
