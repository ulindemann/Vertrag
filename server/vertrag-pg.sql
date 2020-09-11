CREATE DATABASE db_vertrag
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'German_Germany.1252'
    LC_CTYPE = 'German_Germany.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE db_vertrag
    IS 'Vertragsverwaltung';

	-- Table: public.tb_kunden

-- DROP TABLE public.tb_kunden;

CREATE TABLE public.tb_kunden
(
    id integer NOT NULL DEFAULT nextval('tb_kunden_id_seq'::regclass),
    name text COLLATE pg_catalog."default",
    nummer text COLLATE pg_catalog."default",
    strasse text COLLATE pg_catalog."default",
    ort text COLLATE pg_catalog."default",
    telefon text COLLATE pg_catalog."default",
    fax text COLLATE pg_catalog."default",
    mail text COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE public.tb_kunden
    OWNER to postgres;