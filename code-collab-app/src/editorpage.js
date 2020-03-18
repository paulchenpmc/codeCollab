import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles";
import logo from './codeCollabLogo.png';
import './App.css';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

const styles = {
  background: "transparent",
  color: "white",
};

class Editorpage extends React.Component {
  constructor(props){
    super(props);

    this.renderTextbox = this.renderTextbox.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);

    this.state = {
      childkey: 0,
      children: []
    }
  }

  componentDidMount() {
    this.setState({
      children: [this.renderTextbox()]
    });
  }

  renderTextbox() {
    let keyvalue = this.state.childkey;
    this.setState({
      childkey: this.state.childkey + 1,
    });

    return (
      <TextField
        key={keyvalue}
        id="outlined-multiline-flexible"
        label="Editor"
        multiline
        fullWidth
        defaultValue='print("Hello World!")'
        variant="filled"
      />
      );
  }

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
          <IconButton aria-label="add" onClick={this.handleButtonClick}>
            <AddIcon />
          </IconButton>
        </body>
      </div>
    );
  }
}

export default withStyles(styles)(Editorpage);
