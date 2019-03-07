import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'


class New_Game extends Component {
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
        this.props.history.push('/')
      }
    } 
  }

  
    render() {
      const {username} = this.props
      return(
      <div>
        {username}
        <button>Card 1</button>
        <button>Card 2</button>
        <button>Card 3</button>
        <input placeholder='Add your own' />
      </div>
    )
  }
}

const mapStateToProps = reduxState => {
  return reduxState
}
const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(New_Game)