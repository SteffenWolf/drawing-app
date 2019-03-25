-- update users
-- set username = ${username}
-- where username = username;

update users
set profile_pic = $1
where id = $2;
-- returning profile_pic