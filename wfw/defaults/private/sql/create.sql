/*
  (C)2012 ID-INFORMATIK, Webframework (R)
  PL/pgSQL
  Module Utilisateur (WFW_USER)
  
  Prepare la base de données à recevoir le module utilisateur
*/

DROP SCHEMA IF EXISTS wfw CASCADE;
CREATE SCHEMA wfw;
set search_path to 'wfw';

