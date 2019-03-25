import React, {Component} from 'react';
import { connect } from 'react-redux';
import { updateUser, activeGame } from '../../ducks/reducer';
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
      color: 'White',
      lineWidth: 4,
      undos: [],
      redos: [],
      finImage: '',
      isUploading: false,
      url: ''
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
    let undos = this.state.undos

    this.ctx.putImageData(this.state.undos.pop(), 0, 0)
    undos.push(this.ctx.getImageData(0,0, this.image.width, this.image.height))    
    
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




    getSignedRequest = async (file) => {
      console.log(file)
      this.setState({isUploading: true})
      console.log(this.state.finImage)
   
   
      axios.get('/sign-s3', {
        params: {
          'file-name': file.fileName,
          'file-type': file.fileType
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
          'Content-Type': file.fileType,
          'Content-Encoding': file.contentEncoding
        },
      };
  
      axios
        .put(signedRequest, file.fileData, options)
        .then(response => {
        this.sendImage(url)

        })
        .catch(err => {
          this.setState({
            isUploading: false,
          });
          if (err.response !== void 0 && err.response.status === 403) {
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

    sendImage = async (image) => {
      const {id, current_turn} = this.props.game
      
      try {
       await axios.post('/api/game/addimage', {image, id, current_turn})
       this.props.history.push('/new_game')
      } catch( err ) {
        console.log(err);
      }
    }

    submitImage = async () => {
      this.image.current.toBlob(blob => {
        this.getSignedRequest({
          fileName: randomString() + '.png',
          fileData: blob,
          fileType: 'image/png'
        });
      })
    }


    

    
    
  render() {
    const {text} = this.props.game

    return (
        <div className="mainWrap">
          <p class="canvaspusher">You are drawing: {text}</p>
          <canvas ref={this.image} className="canvas" width="500px" height="700px" id="canvas" style={{border: "1px solid black"}}> If you are reading this you are using a browser that is out of date. Please use the most recent version of Firefox or Chrome</canvas>
          <br></br>
          <div className='font-effect-neon'>
            <button className="colors" onClick={() => this.setColor('#0A3410')} style={{borderRadius: '50%', backgroundColor: '#0A3410', height: '25px', width: '25px', border: 'none'}}></button>
            <button className="colors"  onClick={() => this.setColor('#4E1500')} style={{borderRadius: '50%', backgroundColor: '#4E1500', height: '25px', width: '25px', border: 'none'}}></button>
            <button className="colors"  onClick={() => this.setColor('#221B15')} style={{borderRadius: '50%', backgroundColor: '#221B15', height: '25px', width: '25px', border: 'none'}}></button>
            <button className="colors"  onClick={() => this.setColor('#5F2E1F')} style={{borderRadius: '50%', backgroundColor: '#5F2E1F', height: '25px', width: '25px', border: 'none'}}></button>
            <button className="colors"  onClick={() => this.setColor('#000000')} style={{borderRadius: '50%', backgroundColor: '#000000', height: '25px', width: '25px', border: 'none'}}></button>
            <button className="colors"  onClick={() => this.setColor('#021E44')} style={{borderRadius: '50%', backgroundColor: '#021E44', height: '25px', width: '25px', border: 'none'}}></button>
            <button className="colors"  onClick={() => this.setColor('#0C0040')} style={{borderRadius: '50%', backgroundColor: '#0C0040', height: '25px', width: '25px', border: 'none'}}></button>
            <button className="colors"  onClick={() => this.setColor('#102E3C')} style={{borderRadius: '50%', backgroundColor: '#102E3C', height: '25px', width: '25px', border: 'none'}}></button>
            <button className="colors"  onClick={() => this.setColor('#FFEC00')} style={{borderRadius: '50%', backgroundColor: '#FFEC00', height: '25px', width: '25px', border: 'none'}}></button>
            <button className="colors"  onClick={() => this.setColor('#C79B00')} style={{borderRadius: '50%', backgroundColor: '#C79B00', height: '25px', width: '25px', border: 'none'}}></button>
            <button className="colors"  onClick={() => this.setColor('#FFB800')} style={{borderRadius: '50%', backgroundColor: '#FFB800', height: '25px', width: '25px', border: 'none'}}></button>
            <button className="colors"  onClick={() => this.setColor('#DB0000')} style={{borderRadius: '50%', backgroundColor: '#DB0000', height: '25px', width: '25px', border: 'none'}}></button>
            <button className="colors"  onClick={() => this.setColor('#FFFFFF')} style={{borderRadius: '50%', backgroundColor: '#FFFFFF', height: '25px', width: '25px', borderBottomStyle: 'outset', borderColor: 'red', borderWidht: '.1px'}}></button>
            <button className="colors"  onClick={() => this.setColor('rgba(255, 255, 255, 1)', true)}>erase</button>
            <input type="range" min="2" max="75" name="thickness" value={this.state.value}  step="1" onChange={(e) => this.setWidth(e.target.value)} /><label for="thickness">Line Thickness</label> 
            
            {/* <button id="undo" onClick={this.remove}>UNDO</button> */}
            <button onClick={this.submitImage}>Submit</button>
            <br></br>
          </div>
        </div>
    )
 }
}

const mapStateToProps = reduxState => {
  return {
    id: reduxState.id,
    username: reduxState.username,
    game: reduxState.game
  }
  
}
const mapDispatchToProps = {
  updateUser,
  activeGame,
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);