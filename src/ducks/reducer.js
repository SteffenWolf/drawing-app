const initialState = {
  username: '',
  profile_pic: '',
  email: '',
  game: {},
  completedGame: {}
  }
  
  const UPDATE_USER = 'UPDATE_USER'
  const DESTROY_USER = 'DESTROY_USER'
  const ACTIVE_GAME = 'ACTIVE_GAME'
  const COMPLETED_GAME = 'COMPLETED_GAME'
  
  export function updateUser(user) {
    return{
      type: UPDATE_USER,
      payload: user,
    };
  }

  export function clearUser() {
    return {
      type: DESTROY_USER
    }
  }

  export function activeGame(game) {
    return{
      type: ACTIVE_GAME,
      payload: game,
    }
  }

  export function completedGame(completedGame) {
    return{
      type: COMPLETED_GAME,
      payload: completedGame
    }
  }
  
  export default function reducer(state = initialState, action) {
    const{type, payload} = action;
    switch(type) {
      case UPDATE_USER:
        const{id, username, email, profile_pic} = payload;
          return {...state, id, username, profile_pic, email}
        case DESTROY_USER:
          return {...state, id: 0, username: '', profile_pic: '', email: 0}
        case ACTIVE_GAME:
          return {...state, game: payload}
        case COMPLETED_GAME:
          return {...state, completedGame: payload}
      default:
        return state
    }
    
  }