/* eslint-disable */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import DPChat from './routes/DPChat';
import Loading from './routes/Loading';
import Feedback from './routes/Feedback';
import Header from '../src/components/Header';

const App = () => (
  <Router>
    <Header />
    <Switch>
      <Route path="/video">
        <DPChat />
      </Route>
      <Route path="/feedback">
        <Feedback />
      </Route>
      <Route path="/">
        <Loading />
      </Route>
    </Switch>
  </Router>
);

export default App;
