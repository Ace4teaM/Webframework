/*
  (C)2012 ID-INFORMATIK, Webframework (R)
  PL/pgSQL
  Webframework
  
  Prepare la base de données à recevoir les données globales de Webframework
*/

/* supprime la base existante... */

DROP DATABASE IF EXISTS <database_name>;
DROP TABLESPACE IF EXISTS <tablespace_name>;
DROP ROLE IF EXISTS <user_name>;

/* Ajouter les droits d'utilisation */

CREATE ROLE <user_name> WITH LOGIN CREATEDB PASSWORD '<user_pwd>';

/* Ajoute la base de données */

CREATE DATABASE <database_name> OWNER <user_name>;

/* Ajoute l'espace de données et l'assigne à l'utilisateur */

CREATE TABLESPACE <tablespace_name> OWNER <user_name> LOCATION '<web_location>/private/database' ;
ALTER ROLE <user_name> SET DEFAULT_TABLESPACE TO <tablespace_name>;
GRANT ALL ON TABLESPACE <tablespace_name> TO <user_name> ;
ALTER DATABASE <database_name> SET TABLESPACE <tablespace_name>;

SET default_tablespace TO '<tablespace_name>';
