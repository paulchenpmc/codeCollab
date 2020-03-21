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

    this.renderTextbox = this.renderTextbox.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);

    this.state = {
      cellCount: 0,
      children: [],
    }
  }

  componentDidMount() {
    // TODO - Probably replace this with init logic based on
    // pre-existing session (load code cells into editor) vs new session (blank editor)
    this.setState({
      children: [this.renderTextbox('print("Hello World!")')]
    });
  }

  // Creates html for new editor cell.
  // cellContents: Optional arg for the text contents of that editor cell
  renderTextbox(cellContents) {
    let keyvalue = this.state.cellCount;
    this.setState({
      cellCount: this.state.cellCount + 1,
    });
    let cellLabel = "Cell " + keyvalue;
    // If optional arg not given, set default text
    if (!cellContents) {
      cellContents = '';
    }

    return (
      <TextField
        key={keyvalue}
        id="outlined-multiline-flexible"
        label={cellLabel}
        multiline
        fullWidth
        disabled={false}
        defaultValue={cellContents}
        variant="filled"
        InputLabelProps={{
          style: {
            color: 'white'
          }
        }}
        InputProps={{
          style: {
            color: 'white'
          }
        }}
      />
      );
  }

  // Appends an editor cell with supplied text.
  // cellContents: the text contents of that editor cell
  addEditorCell(cellContents) {
    if (!cellContents) {
      cellContents = '';
    }

    this.setState({
      children: this.state.children.concat([this.renderTextbox(cellContents)])
    });
  }

  lockEditorCell(key) {

  }

  unlockEditorCell(key) {

  }

  // Event handler for button click to add new blank editor cell.
  // e: button click event
  handleButtonClick(e) {
    e.preventDefault();

    this.setState({
      children: this.state.children.concat([this.renderTextbox()])
    });
  }

  render() {
    return(
      <div className="App">
        <header className="App-header">
          <Link to='/'><img src={logo} className="App-logo" alt="logo"/></Link>
        </header>
        <body className="App-editor">
          <div className="box-container">
            {this.state.children.map(child => child)}
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
