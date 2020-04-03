import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Homepage from './homepage';
import Editorpage from './editorpage';
import { Provider } from 'mobx-react';
import peer_data from './storage/peer_data';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Provider peer_data={peer_data}>
      <Switch>
        <Route exact path='/' component={Homepage}></Route>
        <Route exact path='/editor' component={Editorpage}></Route>
      </Switch>
    </Provider>
  );
}

export default App;
