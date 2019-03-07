import React, {Component} from 'react'
import { connect } from 'react-redux'
import { updateUser } from '../../ducks/reducer'
import axios from 'axios'

class Board extends Component {
  constructor(props){
    super(props)

    this.state = {
      username: '',
      color: 'black',
      lineWidth: 4,
      undos: []
    }
    this.setColor = this.setColor.bind(this)
  }

  

  componentDidMount(){
    this.initializeCanvas()
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





  initializeCanvas() {
    let isDown = false
    let lastX = null
    let  lastY = null
    let undos = this.state.undos

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    const copyCanvas = async () => {
      await undos.push(ctx.getImageData(0,0, canvas.width, canvas.height))
      console.log(this.state.undos);
    }
    copyCanvas()




    canvas.addEventListener('pointerdown', e => {
      if (e.button === 1) {
        if (undos.length > 0)
        ctx.putImageData(undos.pop(), 0, 0);
        return;
        }
      copyCanvas()
      lastX = e.offsetX;
      lastY = e.offsetY;
      isDown = true;
    });

    

    document.body.addEventListener('pointerup', e => {
      isDown = false;
    });

    document.body.addEventListener('pointermove', e => {
      if(!isDown)
        return;
      let cX = lastX + e.movementX;
      let cY = lastY + e.movementY;
      ctx.lineWidth = this.state.lineWidth;
      ctx.strokeStyle = this.state.color;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(cX, cY)
      ctx.stroke();
      lastX = cX
      lastY = cY
    });
  }

    
    setColor(color) {
      this.setState({color: color})
    }

    setWidth = (num) => {
      this.setState({lineWidth: num})
    }
    
  render() {
    console.log(this.state.lineWidth)
    const {username, id} = this.props
    return (
        <div>
          {username}
          <br></br>
          <canvas width="500px" height="500" id="canvas" style={{border: "1px solid black"}}> If you are reading this you are using a browser that is out of date. Please use the most recent version of Firefox or Chrome</canvas>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <button>undo</button>
          <button>redo</button>
          <button onClick={() => this.setColor('red')}>RED</button>
          <button onClick={() => this.setColor('brown')}>brown</button>
          <button onClick={() => this.setColor('#0A3410')}>green</button>
          <button onClick={() => this.setColor('blue')}>blue</button>
          <button onClick={() => this.setColor('red')}>RED</button>
          <button onClick={() => this.setColor('red')}>RED</button>
          <button onClick={() => this.setColor('red')}>RED</button>
          <button onClick={() => this.setColor('red')}>RED</button>
          <button onClick={() => this.setColor('red')}>RED</button>
          <button onClick={() => this.setColor('red')}>RED</button>
          <button onClick={() => this.setColor('rgba(255, 255, 255, 1)')}>erase</button>
          <input type="range" min="2" max="20" name="thickness" value={this.state.value}  step=".5" onChange={(e) => this.setWidth(e.target.value)} /><label for="thickness">Thicccness</label> 

          <button>UNDO</button>
        </div>
    )
 }
}

const mapStateToProps = reduxState => {
  return {
    id: reduxState.id,
    username: reduxState.username
  }
  
}
const mapDispatchToProps = {
  updateUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);