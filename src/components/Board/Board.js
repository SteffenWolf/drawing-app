import React, {Component} from 'react';
import { connect } from 'react-redux';
import { updateUser } from '../../ducks/reducer';
import axios from 'axios';
import '../../App.css';
import { v4 as randomString } from 'uuid';

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
      isUploading: false,
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
  
    
    setColor(color, isErase) {
      this.ctx.globalCompositeOperation = isErase ? 'destination-out' : 'source-over'
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


    getSignedRequest = ([file]) => {
      this.setState({isUploading: true})
   
      const fileName = `${randomString()}-${file.name.replace(/\s/g, '-')}`
   
      axios.get('/sign-s3', {
        params: {
          'file-name': fileName,
          'file-type': file.type
        }
      }).then( (response) => {
        const { signedRequest, url } = response.data 
        this.uploadFile(file, signedRequest, url)
      }).catch( err => {
        console.log(err)
      })
    }

    uploadFile = (file, signedRequest, url) => {
      const options = {
        headers: {
          'Content-Type': file.type,
        },
      };
  
      axios
        .put(signedRequest, file, options)
        .then(response => {
          this.setState({ isUploading: false, url });
          // THEN DO SOMETHING WITH THE URL. SEND TO DB USING POST REQUEST OR SOMETHING
          
        })
        .catch(err => {
          this.setState({
            isUploading: false,
          });
          if (err.response.status === 403) {
            alert(
              `Your request for a signed URL failed with a status 403. Double check the CORS configuration and bucket policy in the README. You also will want to double check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env and ensure that they are the same as the ones that you created in the IAM dashboard. You may need to generate new keys\n${
                err.stack
              }`
            );
          } else {
            alert(`ERROR: ${err.status}\n ${err.stack}`);
          }
        });
    };


    
    
  render() {
    const {username} = this.props
    return (
        <div className="mainWrap">
          {username}
          <br></br>
          <canvas ref={this.image} className="canvas" width="500px" height="700px" id="canvas" style={{border: "1px solid black"}}> If you are reading this you are using a browser that is out of date. Please use the most recent version of Firefox or Chrome</canvas>
          <br></br>
          <div className='font-effect-neon'>
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
            <button className="colors"  onClick={() => this.setColor('rgba(255, 255, 255, 1)', true)}>erase</button>
            <input type="range" min="2" max="75" name="thickness" value={this.state.value}  step="1" onChange={(e) => this.setWidth(e.target.value)} /><label for="thickness">Thicccness</label> 
            
            <button id="undo" onClick={this.remove}>UNDO</button>
            <button onClick={this.sendImg}>Submit</button>
            <br></br>
          </div>
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