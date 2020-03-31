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
      cellText: [],
      cellLocked: [],
    }
  }

  componentDidMount() {
    // TODO - Probably replace this with init logic based on
    // pre-existing session (load code cells into editor) vs new session (blank editor)
    this.addEditorCell('print("Hello World!")');
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
      />
      );
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

  lockEditorCell = (key) => {
    let temp = this.state.cellLocked;
    temp[key] = true;
    this.setState({ cellLocked:temp });
  }

  unlockEditorCell = (key) => {
    let temp = this.state.cellLocked;
    temp[key] = false;
    this.setState({ cellLocked:temp });
  }

  // Event handler for button click to add new blank editor cell.
  // e: button click event
  handleButtonClick = (e) => {
    e.preventDefault();
    this.addEditorCell();
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
          <IconButton aria-label="add" onClick={this.handleButtonClick} style={{width: '5vw', height: '5vw', marginRight: '47.5vw', marginLeft: '47.5vw'}}>
            <AddIcon style={{color: 'white'}}/>
          </IconButton>
        </body>
      </div>
    );
  }
}

export default Editorpage;
