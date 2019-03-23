insert into game_data (text, game_round, game_id, user_id) values (${text}, ${game_round}, ${game_id}, ${user_id});
update game set current_turn = ${game_round}
where id = ${game_id}