import React, { useEffect, useCallback } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from './views/Home';
import Room from './views/Room';
import Login from './views/Login';
import Register from './views/Register';
import Loader from './views/Loader';
import ProtectedRoute from './protected-route/protected-route';
import useStore from './zustand/store';
import './App.css';

const App: React.FC = () => {
  const { init, loading } = useStore(useCallback(state => ({ init: state.init, loading: state.loading }), []))

  useEffect(() => {
    init(true)
  }, [])

  return (
    <div className="App">
      {loading ?
        <Loader />
      :
        <BrowserRouter>
          <Switch>
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/room" component={Room} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
          </Switch>
        </BrowserRouter>
      }
    </div>
  );
}

export default App;
