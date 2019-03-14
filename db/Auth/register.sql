insert into users (username, password, email, profile_pic)
VALUES (${username}, ${password}, ${email}, 'https://robohash.org/'||${username})
returning username, email