const bcrypt = require('bcryptjs');

module.exports = {
  register: async (req, res) => {
    const { username, password, email, profile_pic } = req.body;
    const { session } = req

    const db = req.app.get('db');
    let takenUsername = await
     db.Auth.check_user({ username, email });
    takenUsername = +takenUsername[0].count;
    if (takenUsername !== 0) {
      return res.sendStatus(409);
    }

    let salt = bcrypt.genSaltSync(13);
    let hash = bcrypt.hashSync(password, salt);
    let user = await 
    db.Auth.register({username, password: hash, email, profile_pic});

    user = user[0];
    console.log(user);

    session.user = user
    res.status(200).send(session.user);
  },

  getUser: (req, res) => {
    const {user} = req.session;
    if (user) {
      res.status(200).send(user);
    }else{
      res.sendStatus(401);
    }
  },

  login: async (req, res) => {
    const {username, password} = req.body;
    const {session} = req;

    const db = req.app.get('db');
    let user = await db.Auth.login({ username });
    
    user = user[0];
    if (!user){
      return res.sendStatus(401);
    }
    let authenticated = bcrypt.compareSync(password, user.password)
    if (authenticated) {
      delete user.password;
      session.user = user;
      res.status(200).send(session.user);
    } else {
      res.sendStatus(401)
    }
  },

  logout:  (req, res) => {
     req.session.destroy(function(){
      res.sendStatus(200)
    })
  },

  deleteUser: (req, res) => {
    const db = req.app.get('db');
    const {id} = req.params;
    console.log(id)

    db.Users.delete_user([id]).then(user => {
      res.status(200).send(user)
    })
    .catch(err => {
      res.status(500).send(err)
    })
  },

  updateUser: async (req, res) => {
    const { profile_pic } = req.body;
    const { id } = req.session.user;
    const db = req.app.get('db');
    
    db.Users.updateUser([profile_pic, id])
    .then(users => {
      res.status(200).send(profile_pic)
    })
    .catch(err => {
      res.status(500).send(err)
    })
  }
}