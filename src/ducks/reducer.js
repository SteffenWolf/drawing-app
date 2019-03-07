const initialState = {
  username: '',
  }
  
  const UPDATE_USER = 'UPDATE_USER'
  const DESTROY_USER = 'DESTROY_USER'
  
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
  
  export default function reducer(state = initialState, action) {
    const{type, payload} = action;
    switch(type) {
      case UPDATE_USER:
        const{id, username} = payload;
        return {...state, id, username};
        case DESTROY_USER:
        return {...state, id: 0, username: ''}
      default:
        return state
    }
    
  }