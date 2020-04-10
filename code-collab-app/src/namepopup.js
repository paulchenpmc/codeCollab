import React from 'react';
import './App.css';
import { Button } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';

class NamePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: '' };
  }

  handleChange = (e) => {
    this.setState({
      title: e.target.value
    });
  }

  handleNewSession = (e) => {
    e.preventDefault();
    this.props.peer.reset(null);
    this.props.peer.create_new_session(this.state.title);
    this.props.history.push({ pathname: '/editor' });
  }

  render() {
    return (
      <div className='popup'>
        <div className='popup_new_doc'>
          <h3>New Document</h3>
          <div className="input-name">
            <input
              type="text"
              name="name"
              placeholder='Enter session name...'
              value={this.state.title}
              onChange={e => this.handleChange(e)}
            ></input>
          </div>
          <Button onClick={(e) => this.handleNewSession(e)} variant='dark'>Create</Button>{'  '}
          <Button onClick={this.props.closePopup} variant="dark">Close</Button>
        </div>
      </div>
    );
  }
}

export default inject('peer_data')(observer(NamePopup));