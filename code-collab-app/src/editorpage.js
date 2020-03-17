import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles";
import logo from './codeCollabLogo.png';
import './App.css';

const styles = {
  root: {
    background: "transparent"
  },
  input: {
    color: "white"
  }
};

function Editorpage(props) {
  const { classes } = props;

  return (
    <div className="App">
      <header className="App-header">
        <Link to='/'><img src={logo} className="App-logo" alt="logo"/></Link>
      </header>
      <body className="App-editor">
        <TextField
            className={classes.root}
            InputProps={{
              className: classes.input
            }}
            id="outlined-multiline-static"
            label="Editor"
            multiline
            fullWidth
            fullHeight
            rows="27"
            defaultValue='print("Hello World!")'
            variant="filled"
        />
      </body>
    </div>
  );
}

export default withStyles(styles)(Editorpage);
