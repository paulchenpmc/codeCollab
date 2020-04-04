import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import logo from './codeCollabLogo.png';
import './App.css';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

class Editorpage extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      cellCount: 0,
      cellText: (this.props.location.data) ? this.props.location.data : [],
      cellLocked: [],
      cellCurrentlyEditing: null,
    }
  }

  componentDidMount() {
    if(this.state.cellText.length === 0){
      this.addEditorCell('print("Hello World!")');
    }
    this.props.location.peer.listen_for_req();
  }

  setCellText = (keyvalue, cellContents) => {
    // Theoretically this is a nicer way to update state,
    //     but it interprets keyvalue as a literal string so it doesn't index properly :/
    // this.setState({
    //   cellText: update(this.state.cellText, {keyvalue: {$set: event.target.value}})
    // });

    // 1. Make a shallow copy of the cellText
    let cellTextCopy = [...this.state.cellText];
    // 2. Mutate local copy to set realtime text contents of cell
    cellTextCopy[keyvalue] = cellContents;
    // 3. Set the state to our new copy
    this.setState({cellText: cellTextCopy});
  }

  // Appends an editor cell with supplied text.
  // cellContents: the text contents of that editor cell
  addEditorCell = (cellContents) => {
    if (!cellContents) {
      cellContents = '';
    }

    this.setState({
      cellText: this.state.cellText.concat(cellContents),
      cellLocked: this.state.cellLocked.concat(false),
    });

    this.setState({
      cellCount: this.state.cellCount + 1,
    });
  }

  // Locks a cell so the user cannot edit it
  // key: the index of the cell to lock
  lockEditorCell = (key) => {
    // Lock cell so user may not edit
    let temp = this.state.cellLocked;
    temp[key] = true;
    this.setState({ cellLocked:temp });
  }

  // Update cell text, then Unlock a cell so the user may edit it
  // key: the index of the cell to unlock
  // updatedCellContents: updated cell text to apply to the cell
  unlockEditorCell = (key, updatedCellContents) => {
    // Update cell with new text
    this.setCellText(key, updatedCellContents);
    // Unlock cell
    let temp = this.state.cellLocked;
    temp[key] = false;
    this.setState({ cellLocked:temp });
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
  broadcastCellUpdate = (key, cellContents) => {
    // TODO - implement socket.io broadcast to update cell for all other peers and release lock
    // Will probably involve calling unlockEditorCell()
    console.log('Broadcasting cell update to peers for cell ' + key);
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
    this.setState({ cellCurrentlyEditing:key });
  }

  // Event handler for cursor leaving a cell. Broadcasts update for that cell and releases lock.
  // e: onBlur event
  // key: index of cell
  leaveCellEvent = (e, key) => {
    e.preventDefault();
    // Get index of last cell edited
    const lastCellEdited = this.state.cellCurrentlyEditing;
    if (lastCellEdited === null) return;

    // Broadcast updates to cell just released from editing
    let text = this.state.cellText[lastCellEdited]; // Select that cell and extract the text
    this.broadcastCellUpdate(lastCellEdited, text);

    // Reset cell last edited state
    this.setState({ cellCurrentlyEditing:null });
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
        onBlur={(e) => this.leaveCellEvent(e, keyvalue)} // When cursor leaves cell
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
          this.setCellText(keyvalue, event.target.value);
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

export default Editorpage;
