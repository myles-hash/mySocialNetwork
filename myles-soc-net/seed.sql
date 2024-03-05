CREATE TABLE posts (
id SERIAL PRIMARY KEY,
title VARCHAR(225),
content TEXT
);



INSERT INTO posts (title, content) VALUES
('This is the first post','hi');

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    username text,
    content text,
    post_id INT REFERENCES posts(id)
);

INSERT INTO comments (username, content, post_id) VALUES
('Myles','This is a comment on the first post', 1);

ALTER TABLE posts ADD user_id text;

ALTER TABLE comments ADD user_id text;

UPDATE posts SET user_id = 'user_2bmkAoKOFFLvZ7YfPJAz6NxgnWu';

UPDATE comments SET user_id = 'user_2bmkAoKOFFLvZ7YfPJAz6NxgnWu';

CREATE TABLE profiles (
id SERIAL PRIMARY KEY,
clerk_user_id text,
username text,
bio text
);

CREATE TABLE reviews (
id SERIAL PRIMARY KEY,
album_id text,
album_image_url text,
album_name text,
spotify_link text,
album_artist text,
album_score text,
album_review text,
fav_track text,
user_id text
);