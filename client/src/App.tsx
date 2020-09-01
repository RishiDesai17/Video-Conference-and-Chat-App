import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from './views/Home';
import Room from './views/Room';
import Login from './views/Login';
import Loader from './views/Loader';
import ProtectedRoute from './protected-route/protected-route';
import { Context } from './context/Context';
import './App.css';

const App: React.FC = () => {
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
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/room" component={Room} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </BrowserRouter>
      }
    </div>
  );
}

export default App;
