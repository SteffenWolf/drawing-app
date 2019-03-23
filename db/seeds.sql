CREATE TABLE "users" (
  "id" serial primary key,
  "username" varchar,
  "email" varchar,
  "password" varchar,
  
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

postgres://

cbrkflyctzmiuq

a56c01ee859b08bc63a58026f882aab38f4b10ea035a7005bb057e7636c4c758

ec2-54-243-128-95.compute-1.amazonaws.com

5432


db8hjv3llicc6d?ssl=true