import React from 'react';
import logo from './codeCollabLogo.png';
import './App.css';
import { Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import peer_data from './storage/peer_data';

class Homepage extends React.Component {
  constructor(props){
    super(props);
    
    peer_data.initialize();
    this.activeSessions = peer_data.session_list;
  }

  handleJoinSession(session_info) {
    peer_data.join_session(session_info[0], session_info[1]);
    this.props.history.push({
      pathname: '/editor',
      data: peer_data.doc_data
    });
    peer_data.listen_for_req();
  }

  handleNewSession() {
    // TODO: Dynamically set session name (get from user?)
    peer_data.create_new_session('Test');
    this.props.history.push('/editor');
    peer_data.listen_for_req();
  }

  renderOneCol(row) {
    return (
      <div className="row">
        <div className="col-sm">
          <ListGroup.Item action onClick={() => {this.handleJoinSession(row[0])}} className="doc">{row[0][0]}</ListGroup.Item>
        </div>
      </div>
    );
  }

  renderTwoCol(row) {
    return (
      <div className="row">
        <div className="col-sm">
          <ListGroup.Item action onClick={() => {this.handleJoinSession(row[0])}} className="doc">{row[0][0]}</ListGroup.Item>
        </div>
        <div className="col-sm">
          <ListGroup.Item action onClick={() => {this.handleJoinSession(row[1])}} className="doc">{row[1][0]}</ListGroup.Item>
        </div>
      </div>
    );
  }

  renderThreeCol(row) {
    return (
      <div className="row">
        <div className="col-sm">
          <ListGroup.Item action onClick={() => {this.handleJoinSession(row[0])}} className="doc">{row[0][0]}</ListGroup.Item>
        </div>
        <div className="col-sm">
          <ListGroup.Item action onClick={() => {this.handleJoinSession(row[1])}} className="doc">{row[1][0]}</ListGroup.Item>
        </div>
        <div className="col-sm">
          <ListGroup.Item action onClick={() => {this.handleJoinSession(row[2])}} className="doc">{row[2][0]}</ListGroup.Item>
        </div>
      </div>
    );
  }

  renderAvailableSessions() {
    let session_rows = [];
    let col_num = 3;
    for (let i = 0; i < this.activeSessions.length; i += col_num) {
      let row = this.activeSessions.slice(i, i + col_num);
      if (row.length === 3) {
        session_rows.push(this.renderThreeCol(row));
      }
      else if (row.length === 2) {
        session_rows.push(this.renderTwoCol(row));
      }
      else if (row.length === 1) {
        session_rows.push(this.renderOneCol(row));
      }
    }
    return session_rows;   
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <span>
            <Link to='/'><img src={logo} className="App-logo" alt="logo"/></Link>{'  '}
            <Button onClick={() => {this.handleNewSession()}} variant='dark'>New Document</Button>{'  '}
            {/* TODO: Add upload functionality and redirect to editor page */}
            <Button variant='dark'>Upload Document</Button>
          </span>
        </header>
        <body>
          <div className="container">
            <h1 className='subheading'>Active Sessions</h1>
            {this.renderAvailableSessions()}
          </div>
        </body>
      </div>  
    );
  }
}

export default Homepage;
