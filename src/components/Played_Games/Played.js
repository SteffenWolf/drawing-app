import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import { updateUser } from '../../ducks/reducer'
// import Auth from '../Auth/Auth'



class Played extends Component {
  constructor(props){
    super(props)

    this.state = {
      username: '',
      id: '',
      text: '',
      completedGame: [],
      fullGame: [],
      isShown: false,
    }
  }

  componentDidMount(){
    this.getUser()
    this.getCompletedGames()
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

  
    render() {
      const { completedGame } = this.state
      let mappedGames = []
      let fullGameMap = []

      if(completedGame.length > 0){
        mappedGames = completedGame.map((game) => <li key={game.game_round} onClick={() => this.getFullGame(game.id)}>{game.text}</li>)
        
      }

      if(this.state.isShown === true && this.state.fullGame){
        fullGameMap = this.state.fullGame.map((game) => {
          if(game.text === null){
            return <div key={game.game_round}>
              <li> Round {game.game_round+1} image.</li>
              <img class="newGamePic" src={game.image} alt="game element"/>
            </div>
          } else {
            return <li key={game.game_round}> {game.game_round+1} {game.text}</li>
          }
        })

      }

      
      return(
      <div class="pusher">
        <div>
        {this.state.isShown ? (
          <div>  {fullGameMap} </div>

          ) : (
            <ul> {mappedGames} </ul>
        )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = reduxState => {
  return reduxState.completedGame
}
const mapDispatchToProps = {
  updateUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Played)