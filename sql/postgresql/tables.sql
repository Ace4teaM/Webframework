/*
  (C)2012 ID-INFORMATIK, Webframework (R)
  PL/pgSQL
  Module Utilisateur (WFW_USER)
  
  Objets
*/

drop table globals  CASCADE;

drop table dyn_table  CASCADE;


/*
  Stockage des variables globales
*/

CREATE TABLE globals (name VARCHAR PRIMARY KEY, value TEXT);


/*
  Index des tables dynamiques
*/

CREATE TABLE dyn_table (
       table_name VARCHAR NOT NULL,
       schema_name VARCHAR NOT NULL,
       CONSTRAINT PK_WFW_DYN_TABLE PRIMARY KEY (table_name,schema_name)
);