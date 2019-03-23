module.exports = {

  createGame: async (req, res) => {
    const { text } = req.body
    const { user_id } = req.session

    const db = req.app.get('db');
    try {
      const game = await db.Game.createGame();
      
      let { game_id } = game[0]
      // await db.Game.createUserGame({user_id, game_id});
      await db.Game.createGameData({game_id, text, game_round:0});
      res.sendStatus(204)
    } catch(err) {
      (console.log(err))
      res.sendStatus(500)
    }
  },

  addImage: async (req,res) => {
    const { image, current_turn, id,  } = req.body
    const  user_id = req.session.user.id

    const db = req.app.get('db');
    try {
      await db.Game.addImage({image, game_round: current_turn+1, game_id: id, user_id});
      res.sendStatus(204)
    } catch(err) {
      console.log(err);
      res.sendStatus(500)
    }
  },

  addText: async (req, res) => {
    const { text, current_turn, id} = req.body
    const  user_id = req.session.user.id    
    
    const db = req.app.get('db')
    try {
      await db.Game.addText({text, game_round: current_turn+1, game_id: id, user_id})
      res.sendStatus(204)
    } catch(err) {
      console.log(err);
      res.sendStatus(500)
      
    }
  },

  getRandomGame: async (req, res) => {
    
    try {
      const db = req.app.get('db');
      
      
      let games = await db.Game.getRandomGame()
      res.status(200).send(games)
    } catch(err) {
      res.status(500).send(err)
      console.log(err)
    }
  },


  getCompleted: async (req, res) => {
    try {
      const db = req.app.get('db');

      let completed = await db.Game.showCompleted();
      res.status(200).send(completed)
    } catch(err) {
      res.status(500).send(err)
      console.log(err)
    }
  },

  getFullGame: async (req, res) => {
    try {
      const db = req.app.get('db');
      let { game_id } = req.params

      let fullGame = await db.Game.getFullGame({game_id});
      res.status(200).send(fullGame)
    } catch(err) {
      res.status(500).send(err)
      console.log(err)
    }
  },

  getUserGame: async (req, res) => {

  }
}
