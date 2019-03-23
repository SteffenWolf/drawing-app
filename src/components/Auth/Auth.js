import React, {Component} from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import { updateUser } from '../../ducks/reducer'



class Auth extends Component {
  constructor(props){
    super(props)

    this.state = {
      username: '',
      password: ''
    }
  }

  componentDidMount() {
    this.checkUser()
  }

  handleChange(prop, val) {
    this.setState({
      [prop]: val
    })
  }

  checkUser = async () => {
    const {id} = this.props;
    if(!id) {
      try {
        let res = await axios.get('/api/auth/current');      
        this.props.updateUser(res.data)
        this.props.history.push('/')
      } catch (err) {
        console.log(err)
        }
      } else {
        this.props.history.push('/new_game')        
      }
    }

    login = async () => {
      let user = {
        username: this.state.username.toLowerCase(),
        password: this.state.password
      }
      try {
        let res = await axios.post('/api/auth/login', user);
        this.props.updateUser(res.data);
        this.props.history.push('/new_game');
      } catch(err){
        console.log(err);
        alert("password or username mismatch")
        
      }
    }

  
    render() {
      const {username, password} = this.state;
      return(
        <div>
          <h1>Login</h1>
          <input placeholder='Username' value={username} onChange={e => this.handleChange('username', e.target.value)}/>
          <br></br>
          <input type='password' placeholder='Password' value={password} onChange={e => this.handleChange('password', e.target.value)}/>
          <br></br>
          <br></br>
          <button onClick={this.login}>Login</button>
          <br></br>
          <Link to="/register"><button>Register</button></Link>

        </div>
    )
  }
}

const mapStateToProps = (reduxState) => {
  return {
    id: reduxState.id,
    username: reduxState.username
  }
}

const mapDispatchToProps = {
  updateUser,
}


export default connect(mapStateToProps, mapDispatchToProps)(Auth)