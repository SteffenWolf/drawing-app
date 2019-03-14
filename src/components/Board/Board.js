import React, {Component} from 'react'
import { connect } from 'react-redux'
import { updateUser } from '../../ducks/reducer'
import axios from 'axios'
import "./Board.css"

class Board extends Component {
  constructor(props){
    super(props)
    this.myImage = React.createRef()
    this.image = React.createRef()
    this.state = {
      username: '',
      color: 'black',
      lineWidth: 4,
      undos: [],
      redos: [],
      finImage: '',
      myImage: []
    }
    this.setColor = this.setColor.bind(this)
  }
  
  
  componentDidMount(){
    this.getUser()
    this.initializeCanvas()
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

  remove = () => {
    this.ctx.putImageData(this.state.undos.pop(), 0, 0)
  }
  
  redo = () => {
    this.ctx.putImageData(this.state.undos.shift())
  }



  initializeCanvas() {
    let isDown = false
    let lastX = null
    let  lastY = null
    let undos = this.state.undos

    var canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');

    const copyCanvas = async () => {
      await undos.push(this.ctx.getImageData(0,0, canvas.width, canvas.height))
    }
    copyCanvas()

    canvas.addEventListener('pointerdown', e => {
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
      this.ctx.lineWidth = this.state.lineWidth;
      this.ctx.strokeStyle = this.state.color;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(lastX, lastY);
      this.ctx.lineTo(cX, cY)
      this.ctx.stroke();
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

    toData = () => {
      this.setState({
        finImage: this.image.current.toDataURL()    
      })
    }

    toImage = () => {
      // let ctx = this.myImage.getContext('2d');

      var img = new Image();
      img.src = this.state.finImage
      img.onload = function() {
        this.img.current.drawImage(img, 0, 0)
      }
    }

    
    
  render() {
    const {username} = this.props
    console.log(this.state.finImage)
    return (
        <div>
          {username}
          <br></br>
          <canvas ref={this.image} className="canvas" width="500px" height="500" id="canvas" style={{border: "1px solid black"}}> If you are reading this you are using a browser that is out of date. Please use the most recent version of Firefox or Chrome</canvas>
          <br></br>
          <button className="colors" onClick={() => this.setColor('#0A3410')}> Sap Green</button>
          <button className="colors"  onClick={() => this.setColor('#4E1500')}>Alizarin Crimson</button>
          <button className="colors"  onClick={() => this.setColor('#221B15')}>Van Dyke Brown</button>
          <button className="colors"  onClick={() => this.setColor('#5F2E1F')}>Dark Sienna</button>
          <button className="colors"  onClick={() => this.setColor('#000000')}>Midnight Black</button>
          <button className="colors"  onClick={() => this.setColor('#021E44')}>Prussian Blue</button>
          <button className="colors"  onClick={() => this.setColor('#0C0040')}>Phthalo Blue</button>
          <button className="colors"  onClick={() => this.setColor('#102E3C')}>Phthalo Green</button>
          <button className="colors"  onClick={() => this.setColor('#FFEC00')}>Cadmium Yellow</button>
          <button className="colors"  onClick={() => this.setColor('#C79B00')}>Yellow Ochre</button>
          <button className="colors"  onClick={() => this.setColor('#FFB800')}>Indian Yellow</button>
          <button className="colors"  onClick={() => this.setColor('#DB0000')}>Bright Red</button>
          <button className="colors"  onClick={() => this.setColor('#FFFFFF')}>Titanium White</button>
          <button className="colors"  onClick={() => this.setColor('rgba(255, 255, 255, 1)')}>erase</button>
          <input type="range" min="2" max="150" name="thickness" value={this.state.value}  step=".5" onChange={(e) => this.setWidth(e.target.value)} /><label for="thickness">Thicccness</label> 

          <button id="undo" onClick={this.remove}>UNDO</button>
          <button onClick={this.toData}>Submit</button>
          <br></br>
          <img src={this.img} alt='test' refs={this.myImage}/>
          <button onClick={this.toImage}>Draw</button>
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