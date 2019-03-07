import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Board from './components/Board/Board'
import Auth from './components/Auth/Auth'
import New_Game from './components/New_Game/New_Game'
import Register from './components/Auth/Register'


export default(
  <Switch>
    <Route path="/register" component={Register} />
    <Route path="/new_game" component={New_Game}/>
    <Route path="/board" component={Board}/>
    <Route path="/" exact component={Auth} />
    
  </Switch>
);