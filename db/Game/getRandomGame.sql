 select game.id, game.current_turn, game_data.image, game_data.text
 from game 
 inner join game_data
 on game.id = game_data.game_id and game.current_turn = game_data.game_round
 where game.current_turn < 8
 ORDER BY RANDOM() LIMIT 3