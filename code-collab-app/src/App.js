import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './homepage';
import Editor from './editorpage';

function App() {
  return (
    <Switch>
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/editor' component={Editor}></Route>
    </Switch>
  );
}

export default App;
