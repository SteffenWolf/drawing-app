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
      profilePic: '',
      editing: false,
      completedGame: [],
      fullGame: [],
      modWidth: 0,
      showOpen: 'hidden',

    }
  }

  componentDidMount(){
    this.getUser()
    this.getCompletedGames()

  }

  getCompletedGames = async () => {
    let res = await axios.get('/api/game/completedgame')

    this.setState({
      completedGame: res.data
    })
  }

  getFullGame = async (game_id) => {

    let res = await axios.get(`/api/game/fullgame/${game_id}`)

    this.setState({
      isShown: true,
      fullGame: res.data
    })
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

  handleChange(prop, val) {
    this.setState({
      [prop]: val
    })
  }

  openMod = () => {
    if(this.state.showOpen === 'hidden'){
      this.setState({
        navWidth: `90%`,
        showOpen: 'visible',
      })
    } else {
      this.setState({
        navWidth: 0,
        showOpen: 'hidden'
      })
    }
  }

  updateUser = async () => {
    let profile_pic = this.state.profilePic

    try {
      let res = await axios.put('/api/user/updateuser', { profile_pic});
      await this.getUser();
      this.props.updateUser(res.data)
      await this.getUser();
      this.reset();
      console.log(res.data)
      console.log(this.props.profile_pic)

    } catch(err) {
      console.log(err);
    }
  }

  reset = () => {
    this.setState({
      profilePic: ''
    })
  }

    render() {
      const {username, email, profile_pic} = this.props
      const {profilePic} = this.state

      return(
        <div class="modContainer">
        <img class="banner" src={profile_pic} alt="profile image"/>
        <span class="openMod" onClick={this.openMod}><i class="fas fa-user-edit"></i></span>
          <div class="mod" style={{visibility: this.state.showOpen, width: this.state.modWidth}}>
            <ul>
              <input placeholder='profilePic' value={profilePic} onChange={e => this.handleChange('profilePic', e.target.value)}/>
              <button onClick={this.updateUser}>Update Profile Pic</button>
              <span>delete account</span>
            </ul>


          </div>
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