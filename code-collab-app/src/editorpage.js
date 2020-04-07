import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import logo from './codeCollabLogo.png';
import './App.css';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { inject, observer } from 'mobx-react';

class Editorpage extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      lockTimeoutID: 0,
    }
  }

  componentDidMount() {
    this.props.peer_data.listen_for_req();
  }

  componentWillUnmount() {
    this.clearLockTimer(); // Always clean up before unmounting
  }

  // Appends an editor cell with supplied text.
  // cellContents: the text contents of that editor cell
  addEditorCell = (cellContents) => {
    if (!cellContents) {
      cellContents = '';
    }
    // peer_data updates the locked value, count and updates other peers
    this.props.peer_data.add_new_cell(cellContents);
  }

  // Locks a cell so the user cannot edit it
  // key: the index of the cell to lock
  lockEditorCell = (key) => {
    // Lock cell so user may not edit
    this.props.peer_data.cell_locked[key] = true;
  }

  // Unlock a cell so the user may edit it
  // key: the index of the cell to unlock
  unlockEditorCell = (key) => {
    this.props.peer_data.cell_locked[key] = false;
  }

  // Requests lock on cell from all peers in session
  // key: index of cell
  requestEditorCellLock = (key) => {
    // TODO - implement socket.io request to lock this cell on all other peers in session
    // Will probably involve calling lockEditorCell()
    console.log('Requesting cell lock from all peers for cell ' + key);
    return true;
  }

  // Broadcast cell update and release lock for all other peers in session
  // key: index of cell
  // cellContents: text contents of the cell update
  broadcastCellUpdate = (key) => {
    // TODO - implement socket.io broadcast to update cell for all other peers and release lock
    // Will probably involve calling unlockEditorCell()
    // call method from peer_data to update other peers // sending updates
    this.props.peer_data.send_cell_update(key);

    // Reset cell last edited state
    this.props.peer_data.current_cell = null;
  }

  startLockTimer = () => {
    // Timer will execute arrow function below when it expires
    let timeoutID = window.setTimeout(
      () => {
        // Broadcast updates to cell just released from editing
        this.broadcastCellUpdate(this.props.peer_data.current_cell);

        // Force blur event on cell (remove cursor from cell)
        document.activeElement.blur();
      },
    10*1000); // 10 Second timeout for cell lock release
    if (this.state.lockTimeoutID !== null) this.clearLockTimer();
    this.setState({ lockTimeoutID:timeoutID });
  }

  clearLockTimer = () => {
    window.clearTimeout(this.state.lockTimeoutID);
    this.setState({ lockTimeoutID:null });
  }

  // Event handler for cursor entering a cell. Requests a lock on the cell from all peers.
  // e: onFocus event
  // key: index of cell
  selectCellEvent = (e, key) => {
    e.preventDefault();
    // Request lock on cell from all peers
    const lockApproved = this.requestEditorCellLock(key);
    if (lockApproved === false) return;

    // Remember the cell currently being edited
    this.props.peer_data.current_cell = key;

    // Start timer to check for lock starvation
    this.startLockTimer();
  }

  // Event handler for cursor leaving a cell. Broadcasts update for that cell and releases lock.
  // e: onBlur event
  // key: index of cell
  leaveCellEvent = (e) => {
    e.preventDefault();

    // Clear lock timer
    this.clearLockTimer();

    // Get index of last cell edited
    const lastCellEdited = this.props.peer_data.current_cell;
    if (lastCellEdited === null) return;

    // Broadcast updates to cell just released from editing
    this.broadcastCellUpdate(lastCellEdited);
  }

  // Event handler for button click to add new blank editor cell.
  // e: button click event
  handleNewCellButtonClick = (e) => {
    e.preventDefault();
    this.addEditorCell();
  }

  // Creates html for new editor cell.
  // cellContents: Optional arg for the text contents of that editor cell
  renderTextbox = (keyvalue) => {
    if (typeof(keyvalue) !== 'number') {
      return;
    }

    let cellLabel = "Cell " + keyvalue.toString();
    let disableCell = this.props.peer_data.cell_locked[keyvalue];
    let textProps = {
      style: {
        color: 'white'
      }
    }
    if (disableCell) {
      textProps = {
        style: {
          color: 'white',
          background: '#de5246'
        }
      }
    }

    return (
      <TextField
        key={keyvalue}
        id="outlined-multiline-flexible"
        label={cellLabel}
        multiline
        onFocus={(e) => this.selectCellEvent(e, keyvalue)} // When cursor enters cell
        onBlur={(e) => this.leaveCellEvent(e)} // When cursor leaves cell
        fullWidth
        disabled={disableCell}
        value={this.props.peer_data.doc_data[keyvalue]}
        variant="filled"
        InputLabelProps={{
          style: {
            color: 'white'
          }
        }}
        InputProps={textProps}
        onChange={(event) => {
          // Update data structure with cell text
          this.props.peer_data.doc_data[keyvalue] = event.target.value;

          // Reset starvation clock timer to zero
          this.startLockTimer();
        }}
      />
      );
  }

  render() {
    return(
      <div className="App">
        <header className="App-header">
          <Link to='/'><img src={logo} className="App-logo" alt="logo"/></Link>
        </header>
        <body className="App-editor">
          <div className="box-container">
            {
              this.props.peer_data.doc_data.map((cellContents, index) => (
                <React.Fragment key={index}>
                  { this.renderTextbox(index, cellContents) }
                </React.Fragment>))
            }
          </div>
          <IconButton aria-label="add" onClick={this.handleNewCellButtonClick} style={{width: '5vw', height: '5vw', marginRight: '47.5vw', marginLeft: '47.5vw'}}>
            <AddIcon style={{color: 'white'}}/>
          </IconButton>
        </body>
      </div>
    );
  }
}

export default inject('peer_data')(observer(Editorpage));
