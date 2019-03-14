import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import { updateUser, clearUser } from '../../ducks/reducer'



class Profile extends Component {
  constructor(props){
    super(props)

    this.state = {
      username: '',
      email: '',
      id: '',
      profile_pic: ''
    }
  }

  componentDidMount(){
    this.getUser()
  }

  getUser = async () => {
    const {id} = this.props;
    if(!id) {
      try {
        let res = await axios.get('/api/auth/current');      
        this.props.updateUser(res.data)
      } catch (err) {
        this.props.history.push('/')
      }
    } 
  }

  deleteUser = async () => {
    axios.delete(`/api/user/delete/${this.props.id}`);
    await axios.post('/api/auth/logout');
    this.props.clearUser();
    console.log(this.props.id)
    await this.props.history.push('/')
  }

  
    render() {
      const {username, email, profile_pic} = this.props
      return(
      <div>
        <img src={profile_pic} alt="profile pic"/>
        <button onClick={this.deleteUser}>delete</button>
        {username}
        {email}
      </div>
    )
  }
}

const mapStateToProps = reduxState => {
  return {
    id: reduxState.id,
    username: reduxState.username,
    profile_pic: reduxState.profile_pic,
    email: reduxState.email
  }
}
const mapDispatchToProps = {
  updateUser,
  clearUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)