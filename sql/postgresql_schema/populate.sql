/*
  (C)2012 ID-INFORMATIK, Webframework (R)
  PL/pgSQL
  Module Utilisateur (WFW_USER)
  
  Jeu de test principale
*/

select wfw.create_table('item_test','wfw');
select wfw.create_table('item_test');
select wfw.add_table_column('item_test','testage','varchar(10)','wfw');
select wfw.drop_table('item_test','wfw');
select wfw.drop_table('item_test');