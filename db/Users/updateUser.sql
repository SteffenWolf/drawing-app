-- update users
-- set username = ${username}
-- where username = username;

update users
set email = ${email}
where id = ${id};