import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Homepage from './homepage';
import Editorpage from './editorpage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Switch>
      <Route exact path='/' component={Homepage}></Route>
      <Route exact path='/editor' component={Editorpage}></Route>
    </Switch>
  );
}

export default App;
