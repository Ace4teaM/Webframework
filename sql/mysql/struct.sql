/*==============================================================*/
/* Nom de SGBD :  MySQL 5.0                                     */
/* Date de cr�ation :  19/12/2012 17:46:01                      */
/*==============================================================*/


drop table if exists GLOBALS;

/*==============================================================*/
/* Table : GLOBALS                                              */
/*==============================================================*/
create table GLOBALS
(
   NAME                 varchar(230) not null,
   VALUE                text,
   primary key (NAME)
);
