import React, { Component } from 'react';
import './App.css';
import './main.css'
import Nav from './components/Nav/Nav';
import routes from './routes'
import {withRouter} from 'react-router-dom'



class App extends Component {
  render() {
    return (
      
      <div className="App">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.0/css/all.css" integrity="sha384-Mmxa0mLqhmOeaE8vgOSbKacftZcsNYDjQzuCOm6D02luYSzBG8vpaOykv9lFQ51Y" crossorigin="anonymous"></link>

          <Nav location={this.props.location}/>
          {routes}
      </div>
    );
  }
}

export default withRouter(App);
