import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import { updateUser } from '../../ducks/reducer'



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
        mappedGames = completedGame.map((game) => <li onClick={() => this.getFullGame(game.id)}>{game.text}{game.id}</li>)
        
      }

      if(this.state.isShown === true && this.state.fullGame){
        fullGameMap = this.state.fullGame.map((game) => {
          if(game.text === null){
            return <div>{game.game_round+1}
              <img src={game.image} alt="game element" key={game.game_round.toString()}/>
            </div>
          } else {
            return <p key={game.game_round.toString()}> {game.game_round+1} {game.text}</p>
          }
        })

      }

      
      return(
      <div>

        {this.state.isShown ? (
          <div>  {fullGameMap} </div>
          ) : (
            <ul>{mappedGames}</ul>
        )}
        <button></button>
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