import React, { Component } from 'react';
import './App.css';
import Nav from './components/Nav/Nav';
import routes from './routes'
import {withRouter} from 'react-router-dom'



class App extends Component {
  render() {
    return (
      
      <div className="App">
        <div className='font-effect-anaglyph'>
          <Nav location={this.props.location}/>
          {routes}
        </div>
      </div>
    );
  }
}

export default withRouter(App);
