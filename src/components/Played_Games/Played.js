import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import { updateUser } from '../../ducks/reducer'



class Played extends Component {
  constructor(props){
    super(props)

    this.state = {
      username: '',
      id: ''
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
        this.props.history.push('/played')
      }
    } 
  }

  
    render() {
      return(
      <div>
        <canvas width="512" height="512" style={{border: "1px solid black"}} ></canvas>
      </div>
    )
  }
}

const mapStateToProps = reduxState => {
  return reduxState
}
const mapDispatchToProps = {
  updateUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Played)