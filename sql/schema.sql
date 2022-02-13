DROP TABLE IF EXISTS events cascade;
CREATE TABLE IF NOT EXISTS events(
	id int primary key,
	name varchar(64) not null,
	slug varchar(64) not null,
	description text,
	created timestamp with time zone not null default current_timestamp,
	lastedit timestamp with time zone not null default current_timestamp
);
DROP TABLE IF EXISTS entry;
CREATE TABLE IF NOT EXISTS entry(
	id int primary key,
	name varchar(64) not null,
	comment text,
	event serial references events(id),
	created timestamp with time zone not null default current_timestamp
);