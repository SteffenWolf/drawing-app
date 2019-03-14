import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'


class Guess extends Component {
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
        this.props.history.push('/guess')
      }
    } 
  }

  
    render() {
      const {username} = this.props
      return(
      <div>
        {/* <img></img>`` 0bcxa 1234567890-/*- */}
        <input placeholder='What is it?' />
        <button>Submit</button>
        {username}
      </div>
    )
  }
}

const mapStateToProps = reduxState => {
  return reduxState
}
const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Guess)