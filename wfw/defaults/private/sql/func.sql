/*
  (C)2012 ID-INFORMATIK, Webframework (R)
  PL/pgSQL
  Module Utilisateur (WFW_USER)
  
  Fonctions et Objets
*/

/*
  Objet de resultat
*/
drop type if exists wfw.result cascade;
create type wfw.result as (
	err_code varchar(20),
	err_str varchar(80)
);

/*
  Convertie un BOOL en CHAR
*/
CREATE OR REPLACE FUNCTION public.bool_to_char(bool_value in boolean)
  RETURNS VARCHAR
as $$
begin
  RETURN case bool_value
    when true then 'true'
    else 'false'
    end;
end;
$$ LANGUAGE plpgsql;

/*
  Définit une variable globale
  Parametres:
	[VARCHAR] p_name  : Nom de la variable
	[VARCHAR] p_value : Valeur à définir
  Retourne:
	[VARCHAR] Valeur
*/
CREATE OR REPLACE FUNCTION wfw.set_global(p_name in VARCHAR, p_value in VARCHAR)
  RETURNS VARCHAR
as $$
begin
	insert into wfw.globals values(lower(p_name),p_value);
	return p_value;
exception
	when unique_violation then
		update wfw.globals set value=p_value where lower(name) = lower(p_name);
		return p_value;
end;
$$ LANGUAGE plpgsql;

/*
  Obtient une variable globale
  Parametres:
	[VARCHAR] p_name      : Nom de la variable
	[VARCHAR] p_def_value : Valeur retourné si introuvable, NULL par défaut
  Retourne:
	[VARCHAR] Valeur
*/
CREATE OR REPLACE FUNCTION wfw.get_global(p_name in VARCHAR,p_def_value in VARCHAR default null)
  RETURNS VARCHAR
as $$
declare
	v_value varchar;
begin
	select value from wfw.globals into strict v_value where lower(name) = lower(p_name);
	return v_value;
exception
	when no_data_found then
		return p_def_value;
end;
$$ LANGUAGE plpgsql;

/*
  Supprime une variable globale
  Parametres:
	[VARCHAR] p_name : Nom de la variable
*/
CREATE OR REPLACE FUNCTION wfw.del_global(p_name in VARCHAR)
  RETURNS void
as $$
begin
	delete from wfw.globals where lower(name) = lower(p_name);
end;
$$ LANGUAGE plpgsql;

/*
  Crée une table dynamique
  Remarque:
           un identificateur primaire est automatiquement créé
*/
CREATE OR REPLACE FUNCTION wfw.create_table(
       p_name varchar(50),
       p_schema varchar(50) default 'public'
)
RETURNS boolean
AS $$
declare
	v_cmd varchar(200);
	v_result boolean;
BEGIN
     -- s'assure que la table n'existe plus
     v_result := wfw.drop_table(p_name,p_schema);
     -- cree la table
     v_cmd := LOWER('CREATE TABLE '||p_schema||'.'||p_name||'( '||p_name||'_id integer primary key );');
     EXECUTE v_cmd;
     -- index la table
     INSERT INTO wfw.dyn_table values(p_name, p_schema);
     return true;
EXCEPTION
  when others then
       return false;
END;
$$ LANGUAGE plpgsql;

/*
  Supprime une table dynamique
*/
CREATE OR REPLACE FUNCTION wfw.drop_table(
       p_name varchar(50),
       p_schema varchar(50) default 'public'
)
RETURNS boolean
AS $$
declare
	v_cmd varchar(200);
	v_entry wfw.dyn_table%rowtype;
BEGIN
     -- selectionne la table dynamique
     SELECT * FROM wfw.dyn_table INTO v_entry
            where table_name = LOWER(p_name) AND schema_name = LOWER(p_schema);
     -- supprime la table
     v_cmd := 'DROP TABLE '||p_schema||'.'||p_name||' CASCADE;';
     EXECUTE v_cmd;
     -- supprime l'entree
     DELETE FROM wfw.dyn_table
            where table_name = LOWER(p_name) AND schema_name = LOWER(p_schema);
     return true;
EXCEPTION
  when others then
       return false;
END;
$$ LANGUAGE plpgsql;

/*
  Ajoute une entree à une table dynamique
*/
CREATE OR REPLACE FUNCTION wfw.add_table_column(
       p_name varchar(50),
       p_column_name varchar(50),
       p_column_type varchar,
       p_schema varchar(50) default 'public'
)
RETURNS boolean
AS $$
declare
	v_cmd varchar(250);
	v_entry wfw.dyn_table%rowtype;
BEGIN
     -- s'assure que la table existe et qu'elle est dynamique
     SELECT * FROM wfw.dyn_table INTO v_entry
            where table_name = LOWER(p_name) AND schema_name = LOWER(p_schema);
     -- ajoute la colonne
     v_cmd := 'alter table '||p_schema||'.'||p_name||' add column '||p_column_name||' '||p_column_type||';';
     EXECUTE v_cmd;
     return true;
EXCEPTION
  when others then
       return false;
END;
$$ LANGUAGE plpgsql;
