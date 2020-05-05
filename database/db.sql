CREATE DATABASE medicine;

USE medicine;
-- users tables
CREATE TABLE users(
    id INT(11) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;

--Medicine tables
CREATE TABLE medicine (
    id INT(11) NOT NULL,
    name VARCHAR(150) NOT NULL,
    dateExpire DATE NOT NULL,
    description TEXT,
    noti INT(11) NOT NULL,
    user_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE medicine
    ADD PRIMARY KEY (id);

ALTER TABLE medicine
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE medicine;

