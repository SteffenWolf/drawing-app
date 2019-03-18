import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from "./ducks/store"


ReactDOM.render(
  
<Provider store={store}>
<link href="https://fonts.googleapis.com/css?family=Allerta+Stencil&effect=anaglyph" rel="stylesheet"></link>
  <HashRouter>
    <App className='font-effect-anaglyph'/>
  </HashRouter>
</Provider>


, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
