const initialState = {
  username: '',
  profile_pic: '',
  email: '',
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
        const{id, username, email, profile_pic} = payload;
        return {...state, id, username, profile_pic, email}
        case DESTROY_USER:
        return {...state, id: 0, username: '', profile_pic: '', email: 0}
      default:
        return state
    }
    
  }