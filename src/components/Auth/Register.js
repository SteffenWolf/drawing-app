import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import { updateUser } from '../../ducks/reducer'



class Register extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      email: '',
      password: '',
      confPass: '',
      btnStat: true,
    }
  }



  componentDidUpdate(prevProps, prevState) {
    if(prevState.password !== this.state.password && prevState.confPass !== this.state.confPass) {
      this.setState({
        btnStat: false
      })
    } 
  }

  async handleChange(prop, val) {
    await this.setState({
      [prop]: val
    })
    console.log(this.state.password, this.state.confPass)
    if (this.state.password === this.state.confPass && this.state.password !== '') {
      this.setState({btnStat: false})

    } else {
      this.setState({btnStat: true})
   }
  }

  register = async (e) => {
    e.preventDefault()
    let user = {
      username: this.state.username.toLowerCase(),
      password: this.state.password,
      email: this.state.email,
      profile_pic: 'https://robohash.org/'+this.state.username.toLowerCase(),
    }
    try {
      let res = await axios.post('/api/auth/register', user);
      this.props.updateUser(res.data);
      this.props.history.push('/profile');

    } catch (err) {
      console.log(err)
      alert('That username is already taken, please create a different username.')
    }

  }

  reset = () => {
    this.setState({
      username: '',
      email: '',
      password: '',
      confPass: '',
    })
  }



  render() {
    const { username, email, password, confPass } = this.state
    return (
      <div>
        <form onSubmit={this.register}>
        <h1>Create an account</h1>
        <input placeholder="Username" value={username} onChange={e => this.handleChange('username', e.target.value)} />
        <br></br>
        <input placeholder="Email" value={email} onChange={e => this.handleChange('email', e.target.value)} />
        <br></br>
        <input placeholder="Password" type="password" value={password} onChange={e => this.handleChange('password', e.target.value)} />
        <br></br>
        <input placeholder="Confirm Password" type="password" value={confPass} onChange={e => this.handleChange('confPass', e.target.value)} />
        <br></br>
        <button type='submit' id='submit' disabled={this.state.btnStat}>Create</button>
        <button onClick={this.reset}>Reset</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (reduxState) => {
  return {

  }
}

const mapDispatchToProps = {
  updateUser,
}


export default connect(mapStateToProps, mapDispatchToProps)(Register)