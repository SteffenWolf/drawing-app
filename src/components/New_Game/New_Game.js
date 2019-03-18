import React, {Component} from 'react'
import {connect} from 'react-redux'
import { updateUser } from '../../ducks/reducer'
import axios from 'axios'


class New_Game extends Component {
  constructor(props){
    super(props)

    this.state = {
      username: '',
      id: '',
      text: '',
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
        this.props.history.push('/new_game')
      }
    } 
  }

  handleChange(prop, val) {
    this.setState({
      [prop]: val
    })
  }

  startGame = async () => {
    let text = this.state.text
    
    try{
      axios.put('/api/game/create', {text});

      console.log(this.state.text);      
      
      this.props.history.push('/board')
    } catch(err) {
      console.log(err);
    }
  }

  reset = () =>{
    this.setState({
      text: ''
    })
  }

  handleSubmitNewGame = () => {
    this.startGame();
    this.reset();
  }

  
    render() {
      const {username} = this.props
      const {text} = this.state.text
      return(
      <div className='font-effect-anaglyph'>
        {username}
        <div>Game Element goes here</div>
        <button>Card 1</button>
        <input placeholder='Add your own' value={text} onChange={e => this.handleChange('text', e.target.value)}/>
        <button onClick={this.startGame}>Submit</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(New_Game)