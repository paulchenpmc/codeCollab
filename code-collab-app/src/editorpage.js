import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles";

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
        <Link to="/">
          <button variant="outlined">
            Home
          </button>
        </Link>
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
      </header>
    </div>
  );
}

export default withStyles(styles)(Editorpage);
