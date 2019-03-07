insert into users (username, password, email)
VALUES (${username}, ${password}, ${email})
returning username, email