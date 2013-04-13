/*
  (C)2012 ID-INFORMATIK, Webframework (R)
  PL/pgSQL
  
  Fonctions et Objets
*/

/*
  Objet de resultat
*/
drop type if exists result cascade;
create type result as (
	err_code varchar(20),   -- contexte de l'erreur ( ERR_OK, ERR_FAILED, ERR_SYSTEM, ... )
	err_str varchar(80),    -- l'erreur ( OPEN_FILE, INVALID_CHAR, ... )
	ext_fields TEXT         -- autres champs ( "name:value;nameB:valueB;..." )
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
CREATE OR REPLACE FUNCTION set_global(p_name in VARCHAR, p_value in VARCHAR)
  RETURNS VARCHAR
as $$
begin
	insert into globals values(lower(p_name),p_value);
	return p_value;
exception
	when unique_violation then
		update globals set value=p_value where lower(name) = lower(p_name);
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
CREATE OR REPLACE FUNCTION get_global(p_name in VARCHAR,p_def_value in VARCHAR /*default null*/)
  RETURNS VARCHAR
as $$
declare
	v_value varchar;
begin
	select value from globals into strict v_value where lower(name) = lower(p_name);
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
CREATE OR REPLACE FUNCTION del_global(p_name in VARCHAR)
  RETURNS void
as $$
begin
	delete from globals where lower(name) = lower(p_name);
end;
$$ LANGUAGE plpgsql;

/*
  Crée une table dynamique
  Remarque:
           un identificateur primaire est automatiquement créé
*/
CREATE OR REPLACE FUNCTION create_table(
       p_name varchar(50),
       p_schema varchar(50) /*default 'public'*/
)
RETURNS boolean
AS $$
declare
	v_cmd varchar(200);
	v_result boolean;
BEGIN
     -- s'assure que la table n'existe plus
     v_result := drop_table(p_name,p_schema);
     -- cree la table
     v_cmd := LOWER('CREATE TABLE '||p_schema||'.'||p_name||'( '||p_name||'_id integer primary key );');
     EXECUTE v_cmd;
     -- index la table
     INSERT INTO dyn_table values(p_name, p_schema);
     return true;
EXCEPTION
  when others then
       return false;
END;
$$ LANGUAGE plpgsql;

/*
  Supprime une table dynamique
*/
CREATE OR REPLACE FUNCTION drop_table(
       p_name varchar(50),
       p_schema varchar(50) /*default 'public'*/
)
RETURNS boolean
AS $$
declare
	v_cmd varchar(200);
	v_entry dyn_table%rowtype;
BEGIN
     -- selectionne la table dynamique
     SELECT * FROM dyn_table INTO v_entry
            where table_name = LOWER(p_name) AND schema_name = LOWER(p_schema);
     -- supprime la table
     v_cmd := 'DROP TABLE '||p_schema||'.'||p_name||' CASCADE;';
     EXECUTE v_cmd;
     -- supprime l'entree
     DELETE FROM dyn_table
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
CREATE OR REPLACE FUNCTION add_table_column(
       p_name varchar(50),
       p_column_name varchar(50),
       p_column_type varchar,
       p_schema varchar(50) /*default 'public'*/
)
RETURNS boolean
AS $$
declare
	v_cmd varchar(250);
	v_entry dyn_table%rowtype;
BEGIN
     -- s'assure que la table existe et qu'elle est dynamique
     SELECT * FROM dyn_table INTO v_entry
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

/*
  @brief Exclue les accents d'une chaine de caractères
  @param p_text Texte à convertir
  @return Texte sans accents
  @remarks Les accents typiques de la langague francaise sont remplacés par des caractères simples. Ex: 'é' devient 'e', 'ç' devient 'c'
*/
create or replace function escape_accents( 
	p_text varchar
)
returns varchar
as $$
begin
  return translate(p_text, 'àäâ'||'éèëê'||'ïî'||'ôö'||'ùûü'||'ÿ'||'ç', 'aaa'||'eeee'||'ii'||'oo'||'uuu'||'y'||'c');
end;
$$
LANGUAGE plpgsql;

/*
  Génère un token aléatoire
    @param int token_length Taille du token
  Retourne:
     [TEXT] Token généré

*/

CREATE OR REPLACE FUNCTION random_token(token_length int)
RETURNS text AS 
$$
DECLARE
  chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
  result text := '';
  i integer := 0;
  chars_length integer := 62; /*array_length(chars, 1); PG-8.4! */
BEGIN
  for i in 1..token_length loop
    result := result || chars[round(random()*(chars_length-1))];
  end loop;
  return result;
END;
$$
LANGUAGE plpgsql;


/*
  Initialialise un nouvel id numerique
*/
CREATE OR REPLACE FUNCTION make_id(
        p_table_name varchar,
        p_id_name varchar
)
RETURNS RESULT AS
$$
DECLARE
	v_id int;
	v_query varchar;
	v_result RESULT;
BEGIN
    v_query = 'select coalesce(max('||p_id_name||')+1,1) from '||p_table_name||';';
    execute v_query into v_id;
    -- ok
    select 'ERR_OK', 'SUCCESS', 'ID:'||v_id||';' into v_result;
    return v_result;
END;
$$
LANGUAGE plpgsql;
