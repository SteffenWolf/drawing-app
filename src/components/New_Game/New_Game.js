import React, {Component} from 'react'
import {connect} from 'react-redux'
import { updateUser, activeGame } from '../../ducks/reducer'
import axios from 'axios'


class New_Game extends Component {
  constructor(props){
    super(props)

    this.state = {
      username: '',
      id: '',
      text: '',
      randomGames: [],
      game: null
    }
  }

  async componentDidMount(){
    this.getUser()
    this.getRandomGames()
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
  
  getRandomGames = async () => {
    let res = await axios.get('/api/game/randomgame')

    this.setState({
      randomGames: res.data
    })

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
      this.reset();

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

  selectGame = async (i) => {
    if (!this.state.randomGames[i]){
      console.log('game not found')
    } else {
      this.setState({
        game: this.state.randomGames[i]
      })
      this.props.activeGame(this.state.randomGames[i]);
    }
    if(this.state.randomGames[i].text === null){
      this.props.history.push('/guess')
    } else {
      this.props.history.push('/board')
    }
  }


  
    render() {
      const {username} = this.props
      const {text} = this.state
      let game1 = 'Fetching..';
      let game2 = 'Fetching..';
      let game3 = 'Fetching..';
      
      if (this.state.randomGames.length === 3) {
        if (this.state.randomGames[0].text === null){
          game1 =   <img class="newGamePic" src={this.state.randomGames[0].image} alt="game element"/>
        } else {
          game1 = <p class="newGameText">  {this.state.randomGames[0].text}</p>
        }

        if (this.state.randomGames[1].text === null){
          game2 = <img class="newGamePic" src={this.state.randomGames[1].image} alt="game element"/>
        } else {
          game2 = <p>{this.state.randomGames[1].text}</p>
        }

        if (this.state.randomGames[2].text === null){
          game3 = <img class="newGamePic" src={this.state.randomGames[2].image} alt="game element"/>
        } else {
          game3 = <p>{this.state.randomGames[2].text}</p>
        }
      }

      return(
      <div className='font-effect-anaglyph'>
        {username}
        <div class="gameEl">{game1}</div>
        <button onClick={() => this.selectGame(0)}> Card 1</button>
        <div>{game2}</div>
        <button onClick={() => this.selectGame(1)}> Card 2</button>
        <div>{game3}</div>
        <button onClick={() => this.selectGame(2)}> Card 3</button>
        <br></br>
        <input placeholder='Add your own' value={text} onChange={e => this.handleChange('text', e.target.value)}/>
        <button onClick={this.handleSubmitNewGame}>Submit</button>
      </div>
    )
  }
}

const mapStateToProps = reduxState => {
  return reduxState.game
}
const mapDispatchToProps = {
  updateUser,
  activeGame
}

export default connect(mapStateToProps, mapDispatchToProps)(New_Game)