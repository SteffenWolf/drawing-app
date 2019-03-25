require('dotenv').config();
const express = require('express');
      session = require('express-session');
      massive = require('massive');
      ac = require('./controllers/auth_controller');
      gc = require('./controllers/game_controller');
      aws = require('aws-sdk');

const pg = require('pg')
const pgSession = require('connect-pg-simple')(session)

const app = express(), {SERVER_PORT,
  CONNECTION_STRING,
  SESSION_SECRET,S3_BUCKET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY} = process.env;

app.use( express.static( `${__dirname}/../build` ) 
);

const pgPool = new pg.Pool({
  connectionString: CONNECTION_STRING
})

app.use(express.json());
app.use(session({
  store: new pgSession({
    pool: pgPool
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 5
  }

}));

massive(CONNECTION_STRING).then(db => {
  app.set('db', db);  
  app.listen(SERVER_PORT, () => console.log(`Welcome from ${SERVER_PORT}`));
});

//AUTH ENDPOINT
app.post('/api/auth/register', ac.register); 
app.post('/api/auth/login', ac.login);
app.post('/api/auth/logout', ac.logout);
app.get('/api/auth/current', ac.getUser);
app.put('/api/user/updateuser', ac.updateUser)

//GAME ENDPOINTS
app.delete('/api/user/delete/:id', ac.deleteUser)
app.put('/api/game/create', gc.createGame)
app.post('/api/game/addimage', gc.addImage)
app.post('/api/game/addtext', gc.addText)
app.get('/api/game/randomgame', gc.getRandomGame)
app.get('/api/game/completedgame', gc.getCompleted)
app.get('/api/game/fullgame/:game_id', gc.getFullGame)
app.get('/api/game/getusergame/', gc.getUserGame)


//S3
app.get('/sign-s3', (req, res) => {

  const s3 = new aws.S3();
  aws.config.update({
    region: 'us-west-2',
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4'
  });
console.log(req.query);

  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };
  console.log('fileType = ', fileType);

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    console.log(data);
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };

    return res.send(returnData)
  });
});
