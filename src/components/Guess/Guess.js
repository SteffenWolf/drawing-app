import React, {Component} from 'react'
import {connect} from 'react-redux'
import { activeGame } from '../../ducks/reducer'
import axios from 'axios'


class Guess extends Component {
  constructor(props){
    super(props)

    this.state = {
      username: '',
      id: '',
      game: {},
      text: ''
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

  async handleChange(prop, val) {
    await this.setState({
      [prop]: val
    })
  }

  submitText = async () => {
    const {id, current_turn} = this.props.game
    const { text } = this.state

    try {
      await axios.post('/api/game/addtext', {text, id, current_turn})
      console.log(text)
      this.props.history.push('/new_game')
    } catch(err) {
      console.log(err)
    }
  }

  
    render() {
      const { text } = this.state
      const {image} = this.props.game
      return(
      <div>
        <img src={ image } alt="game element"/>
        <br></br>
        <input value={text} onChange={e => this.handleChange('text', e.target.value)} placeholder='What is it?' />
        <button onClick={this.submitText} >Submit</button>
      </div>
    )
  }
}

const mapStateToProps = reduxState => {
  return {
    game: reduxState.game
  }
}
const mapDispatchToProps = {
  activeGame
}

export default connect(mapStateToProps, mapDispatchToProps)(Guess)