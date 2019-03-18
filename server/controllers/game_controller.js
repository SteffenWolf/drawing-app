module.exports = {

  createGame: async (req, res) => {
    const { text } = req.body
    const { user_id } = req.session



    const db = req.app.get('db');
    try {
      const game = await db.Game.createGame();
      
      let { game_id} = game[0]
      await db.Game.createUserGame({user_id, game_id});
      await db.Game.createGameData({game_id, text, game_round:1});
      res.sendStatus(204)
    } catch(err) {
      (console.log(err))
      res.sendStatus(500)
    }
  }
  // }
  // update: (req, res) => {}
}
