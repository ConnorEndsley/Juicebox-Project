CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username varchar(255) UNIQUE NOT NULL,
    password varchar(255)  NOT NULL
);

INSERT INTO users (username, password)
VALUES
    ('albert', 'bertie99'),
    ('sandra', '2sandy4me'),
    ('glamgal', 'soglam');

 # INSERT 0 3

 SELECT ID FROM users LIMIT 1;

 SELECT id, username FROM users WHERE username='albert' AND password='bertie99';

DROP TABLE users;

 DROP TABLE IF EXISTS users;