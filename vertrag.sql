// nur zur info

// Tabelle Standorte
CREATE TABLE `db_vertrag`.`tb_standorte` ( `id` SERIAL NOT NULL AUTO_INCREMENT , `name` VARCHAR(64) NOT NULL , UNIQUE (`id`)) ENGINE = InnoDB;

// Postgres 

-- Table: public.tb_vertrag

-- DROP TABLE public.tb_vertrag;

CREATE TABLE public.tb_vertrag
(
    id integer NOT NULL DEFAULT nextval('tb_vertrag_id_seq'::regclass),
    nummer character varying(64) COLLATE pg_catalog."default" NOT NULL,
    id_kunde integer NOT NULL,
    id_standort integer NOT NULL,
    id_vertragsart integer NOT NULL,
    betrag numeric NOT NULL,
    faktor integer NOT NULL,
    start date NOT NULL,
    laufzeit integer NOT NULL,
    kuefrist integer NOT NULL,
    vorlauf integer NOT NULL,
    kueinfo date NOT NULL,
    flag smallint NOT NULL,
    pfad character varying(256) COLLATE pg_catalog."default",
    file character varying(64) COLLATE pg_catalog."default" NOT NULL,
    sonstiges text COLLATE pg_catalog."default",
    lastmod timestamp with time zone,
    CONSTRAINT tb_vertrag_pkey PRIMARY KEY (id),
    CONSTRAINT key_art FOREIGN KEY (id_vertragsart)
        REFERENCES public.tb_vertragsart (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT key_kunde FOREIGN KEY (id_kunde)
        REFERENCES public.tb_kunden (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT key_standort FOREIGN KEY (id_standort)
        REFERENCES public.tb_standort (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public.tb_vertrag


-- Table: public.tb_vertragsart

-- DROP TABLE public.tb_vertragsart;

CREATE TABLE public.tb_vertragsart
(
    id integer NOT NULL DEFAULT nextval('tb_vertragsart_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tb_vertragsart_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.tb_vertragsart
    OWNER to postgres;

GRANT ALL ON TABLE public.tb_vertragsart TO postgres;


-- Table: public.tb_standort

-- DROP TABLE public.tb_standort;

CREATE TABLE public.tb_standort
(
    id integer NOT NULL DEFAULT nextval('tb_standort_id_seq'::regclass),
    name character varying(16) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tb_standort_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.tb_standort
    OWNER to postgres;

GRANT ALL ON TABLE public.tb_standort TO postgres;

-- Table: public.tb_kunden

-- DROP TABLE public.tb_kunden;

CREATE TABLE public.tb_kunden
(
    id integer NOT NULL DEFAULT nextval('tb_kundem_id_seq'::regclass),
    name character varying(64) COLLATE pg_catalog."default" NOT NULL,
    nummer character varying(32) COLLATE pg_catalog."default" NOT NULL,
    strasse character varying(64) COLLATE pg_catalog."default" NOT NULL,
    plzort character varying(32) COLLATE pg_catalog."default" NOT NULL,
    telefon character varying(32) COLLATE pg_catalog."default" NOT NULL,
    fax character varying(32) COLLATE pg_catalog."default",
    mail character varying(32) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tb_kundem_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.tb_kunden
    OWNER to postgres;

GRANT ALL ON TABLE public.tb_kunden TO postgres;


// User Table 
-- Table: public.tb_user

-- DROP TABLE public.tb_user;

CREATE TABLE public.tb_user
(
    id integer NOT NULL DEFAULT nextval('tb_user_id_seq'::regclass),
    name character varying(32) COLLATE pg_catalog."default" NOT NULL,
    admin boolean NOT NULL,
    standorte character varying(32)[] COLLATE pg_catalog."default",
    CONSTRAINT tb_user_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.tb_user
    OWNER to postgres;


// Kuendigungen 
-- Table: public.tb_kuendigung

-- DROP TABLE public.tb_kuendigung;

CREATE TABLE public.tb_kuendigung
(
    -- Inherited from table public.tb_vertrag: id integer NOT NULL DEFAULT nextval('tb_vertrag_id_seq'::regclass),
    -- Inherited from table public.tb_vertrag: nummer character varying(64) COLLATE pg_catalog."default" NOT NULL,
    -- Inherited from table public.tb_vertrag: id_kunde integer NOT NULL,
    -- Inherited from table public.tb_vertrag: id_standort integer NOT NULL,
    -- Inherited from table public.tb_vertrag: id_vertragsart integer NOT NULL,
    -- Inherited from table public.tb_vertrag: betrag numeric NOT NULL,
    -- Inherited from table public.tb_vertrag: faktor integer NOT NULL,
    -- Inherited from table public.tb_vertrag: start date NOT NULL,
    -- Inherited from table public.tb_vertrag: laufzeit integer NOT NULL,
    -- Inherited from table public.tb_vertrag: kuefrist integer NOT NULL,
    -- Inherited from table public.tb_vertrag: vorlauf integer NOT NULL,
    -- Inherited from table public.tb_vertrag: kueinfo date NOT NULL,
    -- Inherited from table public.tb_vertrag: flag smallint NOT NULL,
    -- Inherited from table public.tb_vertrag: pfad character varying(256) COLLATE pg_catalog."default",
    -- Inherited from table public.tb_vertrag: file character varying(64) COLLATE pg_catalog."default" NOT NULL,
    -- Inherited from table public.tb_vertrag: sonstiges text COLLATE pg_catalog."default",
    -- Inherited from table public.tb_vertrag: lastmod timestamp with time zone
)
    INHERITS (public.tb_vertrag)
TABLESPACE pg_default;

ALTER TABLE public.tb_kuendigung
    OWNER to postgres;


