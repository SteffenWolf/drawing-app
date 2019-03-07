import React from 'react';
import {Link} from 'react-router-dom';

function Nav(props) {

  if (props.location.pathname !== '/' && props.location.pathname !== '/register'){
    return(
      <div>
        <Link to={'/board'}><button>Current Game</button></Link>
        <Link to={'/new_game'}><button>New Game</button></Link>
        <Link to={'/'}  ><button>Logout</button></Link>
      </div>
    )
    
   } else {
    return null

  }  
}

export default Nav