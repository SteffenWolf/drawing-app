require('dotenv').config();
const express = require('express'),
      session = require('express-session')
      massive = require('massive')
      ac = require('./controllers/auth_controller')
      gc = require('./controllers/game_controller')

const pg = require('pg')
const pgSession = require('connect-pg-simple')(session)

const app = express(), {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env;

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

//ENDPOINTS
app.post('/api/auth/register', ac.register); 
app.post('/api/auth/login', ac.login);
app.get('/api/auth/current', ac.getUser) 
