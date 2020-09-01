import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from './views/Home';
import Room from './views/Room';
import Login from './views/Login';
import Loader from './views/Loader';
import { Context } from './context/Context';
import axios from 'axios';
import './App.css';

const App: React.FC = () => {
  const [initialising, setInitialising] = useState<boolean>(true)
  const { init, state } = useContext(Context)

  useEffect(() => {
    init(true)
  }, [])

  return (
    <div className="App">
      {state.loading ?
        <Loader />
      :
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/room" component={Room} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </BrowserRouter>
      }
    </div>
  );
}

export default App;
