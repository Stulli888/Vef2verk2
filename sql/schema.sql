DROP TABLE IF EXISTS events cascade;
CREATE TABLE IF NOT EXISTS events(
	id serial primary key,
	name varchar(64) not null,
	slug varchar(64) not null,
	description text,
	created timestamp with time zone not null default current_timestamp,
	lastedit timestamp with time zone not null default current_timestamp
);

DROP TABLE IF EXISTS entries;
CREATE TABLE IF NOT EXISTS entries(
	id serial primary key,
	name varchar(64) not null,
	comment text,
	event serial references events(id),
	created timestamp with time zone not null default current_timestamp
);

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  id serial primary key,
  username character varying(64) NOT NULL,
  password character varying(256) NOT NULL
);

-- Lykilorð: "123"
INSERT INTO users (username, password) VALUES ('admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii');
