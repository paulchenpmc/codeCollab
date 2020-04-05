import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import logo from './codeCollabLogo.png';
import './App.css';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { inject, observer } from 'mobx-react';
import { Button } from 'react-bootstrap';
import { saveAs } from 'file-saver';

class Editorpage extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      cellText: this.props.peer_data.doc_data,
      cellLocked: this.props.peer_data.cell_locked,
    }
  }

  componentDidMount() {
    this.props.peer_data.listen_for_req();
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
    this.props.peer_data.set_cell_locked(key, true);
  }

  // Unlock a cell so the user may edit it
  // key: the index of the cell to unlock
  unlockEditorCell = (key) => {
    this.props.peer_data.set_cell_locked(key, false);

  }

  // Requests lock on cell from all peers in session
  // key: index of cell
  requestEditorCellLock = (key) => {
    // TODO - implement socket.io request to lock this cell on all other peers in session
    // Will probably involve calling lockEditorCell()
    console.log('Cell ' + key + ': Requesting cell lock from all peers');
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
    this.props.peer_data.set_current_cell(key);
  }

  // Event handler for cursor leaving a cell. Broadcasts update for that cell and releases lock.
  // e: onBlur event
  // key: index of cell
  leaveCellEvent = (e) => {
    e.preventDefault();
    // Get index of last cell edited
    const lastCellEdited = this.props.peer_data.get_current_cell();
    if (lastCellEdited === null) return;

    // Broadcast updates to cell just released from editing
    this.broadcastCellUpdate(lastCellEdited);

    // Reset cell last edited state
    this.props.peer_data.set_current_cell(null);
  }

  // Event handler for button click to add new blank editor cell.
  // e: button click event
  handleNewCellButtonClick = (e) => {
    e.preventDefault();
    this.addEditorCell();
  }

  // Event handler for download document button.
  // e: button click event
  handleDownloadDocumentClick = (e) => {
    e.preventDefault();
    const cellDivider = '\n--------------------------------------------------------------\n';
    let documentString = '';
    for (let i = 0; i < this.state.cellText.length; i++) {
      if (i !== 0) {
        documentString += cellDivider;
      }
      documentString += this.state.cellText[i];
    }
    var blob = new Blob([documentString], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "codeCollabDocument.txt"); // Opens file dialog on client with this as default filename
  }

  // Creates html for new editor cell.
  // cellContents: Optional arg for the text contents of that editor cell
  renderTextbox = (keyvalue) => {
    if (typeof(keyvalue) !== 'number') {
      return;
    }

    let cellLabel = "Cell " + keyvalue.toString();
    let disableCell = this.state.cellLocked[keyvalue];
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
        value={this.state.cellText[keyvalue]}
        variant="filled"
        InputLabelProps={{
          style: {
            color: 'white'
          }
        }}
        InputProps={textProps}
        onChange={(event) => {
          this.props.peer_data.update_existing_cell(keyvalue, event.target.value);
        }}
      />
      );
  }

  render() {
    return(
      <div className="App">
        <header className="App-header">
          <span>
            <Link to='/'><img src={logo} className="App-logo" alt="logo"/></Link>{'  '}
            <Button onClick={this.handleDownloadDocumentClick} variant='dark'>Download Document</Button>{'  '}
          </span>
        </header>
        <body className="App-editor">
          <div className="box-container">
            {
              this.state.cellText.map((cellContents, index) => (
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
