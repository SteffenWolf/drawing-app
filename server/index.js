require('dotenv').config();
const express = require('express');
      session = require('express-session');
      massive = require('massive');
      ac = require('./controllers/auth_controller');
      gc = require('./controllers/game_controller');
      aws = require('aws-sdk');

// const pg = require('pg')
// const pgSession = require('connect-pg-simple')(session)

const app = express(), {SERVER_PORT,
  CONNECTION_STRING,
  SESSION_SECRET,S3_BUCKET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY} = process.env;

// const pgPool = new pg.Pool({
//   connectionString: CONNECTION_STRING
// })

app.use(express.json());
app.use(session({
  // store: new pgSession({
  //   pool: pgPool
  // }),
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

//ENDPOINTS
app.post('/api/auth/register', ac.register); 
app.post('/api/auth/login', ac.login);
app.post('/api/auth/logout', ac.logout);
app.get('/api/auth/current', ac.getUser);


app.delete('/api/user/delete/:id', ac.deleteUser)
app.put('/api/game/create', gc.createGame)
// app.put('/api/game/update', gc.update)

//S3
app.get('/sign-s3', (req, res) => {

  aws.config = {
    region: 'us-west-1',
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }

  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };

    return res.send(returnData)
  });
});