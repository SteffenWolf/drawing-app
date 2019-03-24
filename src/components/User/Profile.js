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
      profile_pic: '',
      editing: false,
      completedGame: [],
      fullGame: [],

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

  setEdit = () => {
    this.setState({
      editing: true
    });
  }

  updateUser = (username) => {
    const { email } = this.props;
    this.props.update( username, email );
    this.setState({
      editing: false,
      email: this.state.email,
      username: this.state.username,
    })

  }

  
    render() {

      const {username, email} = this.props

      

      return(
      <div>
        <div class="pusher">
          <div>{username}</div>
          <div>{email}</div>
          <i class="fas fa-user-edit fa-3x" onClick={updateUser}></i>
          <button onClick={this.deleteUser}>delete</button>
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