import React from 'react';
import logo from './codeCollabLogo.png';
import './App.css';
import { Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Popup from './uploadpopup';
import NamePopup from './namepopup';

class Homepage extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      showPopup: false, 
      showNamePopup: false
    };
    props.peer_data.initialize();
  }

  handleJoinSession(session_info) {
    this.props.peer_data.reset(session_info.id);
    this.props.peer_data.join_session(session_info.document_name, session_info.id);
    this.props.history.push({pathname: '/editor'});
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  toggleNamePopup() {
    this.setState({
      showNamePopup: !this.state.showNamePopup
    });
  }

  renderOneCol(row) {
    return (
      <div className="row">
        <div className="col-sm">
          <ListGroup.Item action onClick={() => {this.handleJoinSession(row[0])}} className="doc">{row[0].document_name}</ListGroup.Item>
        </div>
      </div>
    );
  }

  renderTwoCol(row) {
    return (
      <div className="row">
        <div className="col-sm">
          <ListGroup.Item action onClick={() => {this.handleJoinSession(row[0])}} className="doc">{row[0].document_name}</ListGroup.Item>
        </div>
        <div className="col-sm">
          <ListGroup.Item action onClick={() => {this.handleJoinSession(row[1])}} className="doc">{row[1].document_name}</ListGroup.Item>
        </div>
      </div>
    );
  }

  renderThreeCol(row) {
    return (
      <div className="row">
        <div className="col-sm">
          <ListGroup.Item action onClick={() => {this.handleJoinSession(row[0])}} className="doc">{row[0].document_name}</ListGroup.Item>
        </div>
        <div className="col-sm">
          <ListGroup.Item action onClick={() => {this.handleJoinSession(row[1])}} className="doc">{row[1].document_name}</ListGroup.Item>
        </div>
        <div className="col-sm">
          <ListGroup.Item action onClick={() => {this.handleJoinSession(row[2])}} className="doc">{row[2].document_name}</ListGroup.Item>
        </div>
      </div>
    );
  }

  renderAvailableSessions() {
    let session_rows = [];
    let col_num = 3;
    for (let i = 0; i < this.props.peer_data.session_list.length; i += col_num) {
      let row = this.props.peer_data.session_list.slice(i, i + col_num);
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
            <Button onClick={this.toggleNamePopup.bind(this)} variant='dark'>New Document</Button>{'  '}
            <Button onClick={this.togglePopup.bind(this)} variant='dark'>Upload</Button>
          </span>
        </header>
        <body>
          <div>
            {this.state.showNamePopup ?
              <NamePopup peer={this.props.peer_data} history={this.props.history} closePopup={this.toggleNamePopup.bind(this)}/>
              : null}
          </div>
          <div>
            {this.state.showPopup ?
              <Popup peer={this.props.peer_data} history={this.props.history} closePopup={this.togglePopup.bind(this)}/>
              : null}
          </div>
          <div className="container">
            <h1 className='subheading'>Active Sessions</h1>
            {this.renderAvailableSessions()}
          </div>
        </body>
      </div>  
    );
  }
}

export default inject('peer_data')(observer(Homepage));
