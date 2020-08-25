import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import Home from './views/Home';
import Room from './views/Room';
import Login from './views/Login';
import Copy from "./views/Copy";
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route exact path="/room" component={Room} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/copy" component={Copy} />
      </BrowserRouter>
    </div>
  );
}

export default App;
