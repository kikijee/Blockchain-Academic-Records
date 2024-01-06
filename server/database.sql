-- Some example posgresql commands

-- CREATE DATABASE blockteam;

INSERT INTO "Users" ("Email","FirstName","LastName","DateOfBirth","AuthenticationData","Role") VALUES ('christian@gmail.com','Christian','Manibusan','2001-01-01','$2b$10$kPD59BPUx/amXEwN3MGUD.3lgR5PjiNy.FUs9sxt37EJs2B8XXa7.','Admin');
-- password for above user is 'test'

TRUNCATE users;
DELETE FROM users;

-- psql -U postgres (login)
-- \c (cd)
-- \l (ls)
-- \dt (show data tables)
-- \d (show data)
-- CREATE DATABASE blockteam; (create database)
