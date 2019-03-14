import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Board from './components/Board/Board'
import Auth from './components/Auth/Auth'
import New_Game from './components/New_Game/New_Game'
import Register from './components/Auth/Register'
import Guess from './components/Guess/Guess'
import Played from './components/Played_Games/Played';
import Profile from './components/User/Profile'


export default(
  <Switch>
    <Route path="/register" component={Register} />
    <Route path="/new_game" component={New_Game}/>
    <Route path="/played" component={Played}/>
    <Route path="/board" component={Board}/>
    <Route path='/guess' component={Guess}/>
    <Route path='/profile' component={Profile}/>
    <Route path="/" exact component={Auth}/>
    
  </Switch>
);