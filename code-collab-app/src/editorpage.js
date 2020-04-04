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
    let temp = this.state.cellLocked;
    temp[key] = true;
    this.setState({ cellLocked:temp });
  }

  // Unlocks a cell so the user may edit it
  // key: the index of the cell to unlock
  unlockEditorCell = (key) => {
    let temp = this.state.cellLocked;
    temp[key] = false;
    this.setState({ cellLocked:temp });
  }

  // Requests lock on cell from all peers in session
  // key: index of cell
  requestEditorCellLock = (key) => {
    // TODO - implement socket.io request to lock this cell on all other peers in session
    console.log('Requesting cell lock from all peers for cell ' + key);
    return true;
  }

  // Broadcast cell update and release lock for all other peers in session
  // key: index of cell
  // cellContents: text contents of the cell update
  broadcastCellUpdate = (key, cellContents) => {
    // TODO - implement socket.io broadcast to update cell for all other peers and release lock
    console.log('Broadcasting cell update to peers for cell ' + key);
  }

  // Event handler for cursor entering a cell. Requests a lock on the cell from
  // all peers
  // e: onFocus event
  // key: index of cell
  selectCellEvent = (e, key) => {
    e.preventDefault();
    // BROADCAST UPDATE AND RELEASE LOCK FROM LAST CELL EDITED
    // Get text of cell just released from editing
    const lastCellEdited = this.state.cellCurrentlyEditing;
    if (lastCellEdited !== null) {
      // Broadcast updates to cell just released from editing
      let text = this.state.cellText[lastCellEdited]; // Select that cell and extract the text
      this.broadcastCellUpdate(lastCellEdited, text);
    }

    // REQUEST LOCK ON NEW CELL
    this.setState({ cellCurrentlyEditing:null });
    const lockApproved = this.requestEditorCellLock(key);
    if (lockApproved === false) return;
    // Save the cell currently being edited
    this.setState({ cellCurrentlyEditing:key });
  }

  // Event handler for button click to add new blank editor cell.
  // e: button click event
  handleNewCellButtonClick = (e) => {
    e.preventDefault();
    this.addEditorCell();
  }

  // Creates html for new editor cell.
  // cellContents: Optional arg for the text contents of that editor cell
  renderTextbox = (keyvalue, cellContents) => {
    if (typeof(keyvalue) !== 'number') {
      return;
    }
    // If optional arg not given, set default text
    if (!cellContents) {
      cellContents = '';
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
        onFocus={(e) => this.selectCellEvent(e, keyvalue)}
        fullWidth
        disabled={disableCell}
        defaultValue={cellContents}
        variant="filled"
        InputLabelProps={{
          style: {
            color: 'white'
          }
        }}
        InputProps={textProps}
        onChange={(event) => {
          // Theoretically this is a nicer way to update state, but it interprets keyvalue as a literal string so it doesn't index properly :/
          // this.setState({
          //   cellText: update(this.state.cellText, {keyvalue: {$set: event.target.value}})
          // });

          // 1. Make a shallow copy of the cellText
          let cellTextCopy = [...this.state.cellText];
          // 2. Mutate local copy to set realtime text contents of cell
          cellTextCopy[keyvalue] = event.target.value;
          // 3. Set the state to our new copy
          this.setState({cellText: cellTextCopy});
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
