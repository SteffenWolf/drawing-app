insert into users (username, password, email, profile_pic)
VALUES (${username}, ${password}, ${email}, ${profile_pic})
returning username, email, profile_pic