-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP SEQUENCE public.events_id_seq;

CREATE SEQUENCE public.events_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.events_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.events_id_seq TO postgres;

-- DROP SEQUENCE public.hibernate_sequence;

CREATE SEQUENCE public.hibernate_sequence
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.hibernate_sequence OWNER TO postgres;
GRANT ALL ON SEQUENCE public.hibernate_sequence TO postgres;

-- DROP SEQUENCE public.rooms_id_seq;

CREATE SEQUENCE public.rooms_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.rooms_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.rooms_id_seq TO postgres;

-- DROP SEQUENCE public.usr_id_seq;

CREATE SEQUENCE public.usr_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.usr_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.usr_id_seq TO postgres;
-- public.events определение

-- Drop table

-- DROP TABLE public.events;

CREATE TABLE public.events (
	id bigserial NOT NULL,
	event_content varchar(255) NULL,
	event_date timestamp NULL,
	room_id int8 NULL,
	start_event_time varchar(255) NULL,
	stop_event_time varchar(255) NULL,
	user_id int8 NULL,
	CONSTRAINT events_pkey PRIMARY KEY (id)
);

-- Table Triggers

create trigger check_event_overlap before
insert
    on
    public.events for each row execute function check_event_overlap();
create trigger check_event_update_overlap before
update
    on
    public.events for each row execute function check_event_update_overlap();

-- Permissions

ALTER TABLE public.events OWNER TO postgres;
GRANT ALL ON TABLE public.events TO postgres;


-- public.rooms определение

-- Drop table

-- DROP TABLE public.rooms;

CREATE TABLE public.rooms (
	id bigserial NOT NULL,
	room_name varchar(255) NULL,
	status varchar(255) NULL,
	CONSTRAINT rooms_pkey PRIMARY KEY (id)
);

-- Table Triggers

create trigger delete_events_on_room_delete after
delete
    on
    public.rooms for each row execute function delete_events_on_room_delete();
create trigger check_room_name_uniqueness before
insert
    on
    public.rooms for each row execute function check_room_name_unique();

-- Permissions

ALTER TABLE public.rooms OWNER TO postgres;
GRANT ALL ON TABLE public.rooms TO postgres;


-- public.usr определение

-- Drop table

-- DROP TABLE public.usr;

CREATE TABLE public.usr (
	id bigserial NOT NULL,
	"password" varchar(255) NULL,
	username varchar(255) NULL,
	"role" varchar(255) NULL,
	CONSTRAINT usr_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.usr OWNER TO postgres;
GRANT ALL ON TABLE public.usr TO postgres;



-- DROP FUNCTION public.check_event_overlap();

CREATE OR REPLACE FUNCTION public.check_event_overlap()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  existing_event RECORD;
  new_start_time TIME;
  new_stop_time TIME;
  existing_start_time TIME;
  existing_stop_time TIME;
BEGIN
  new_start_time := (NEW.start_event_time::TIME);
  new_stop_time := (NEW.stop_event_time::TIME);

  FOR existing_event IN
    SELECT * FROM events WHERE room_id = NEW.room_id AND event_date = NEW.event_date
  LOOP
    existing_start_time := (existing_event.start_event_time::TIME);
    existing_stop_time := (existing_event.stop_event_time::TIME);

    IF (
      (new_start_time <= existing_start_time AND new_stop_time > existing_start_time) OR
      (new_start_time < existing_stop_time AND new_stop_time >= existing_stop_time) OR
      (new_start_time >= existing_start_time AND new_stop_time <= existing_stop_time)
    ) THEN
      RAISE EXCEPTION 'The new event time range overlaps with the existing event time range.';
      RETURN NULL;
    END IF;
  END LOOP;

  RETURN NEW; -- Возвращаем NEW, чтобы разрешить операцию
END;
$function$
;

-- Permissions

ALTER FUNCTION public.check_event_overlap() OWNER TO postgres;
GRANT ALL ON FUNCTION public.check_event_overlap() TO postgres;

-- DROP FUNCTION public.check_event_update_overlap();

CREATE OR REPLACE FUNCTION public.check_event_update_overlap()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  existing_event RECORD;
  new_start_time TIME;
  new_stop_time TIME;
  existing_start_time TIME;
  existing_stop_time TIME;
BEGIN
  new_start_time := (NEW.start_event_time::TIME);
  new_stop_time := (NEW.stop_event_time::TIME);

  FOR existing_event IN
     SELECT * FROM events WHERE room_id = NEW.room_id AND event_date = NEW.event_date AND id != NEW.id
  LOOP
    existing_start_time := (existing_event.start_event_time::TIME);
    existing_stop_time := (existing_event.stop_event_time::TIME);

    IF (
      (new_start_time <= existing_start_time AND new_stop_time > existing_start_time) OR
      (new_start_time < existing_stop_time AND new_stop_time >= existing_stop_time) OR
      (new_start_time >= existing_start_time AND new_stop_time <= existing_stop_time)
    ) THEN
      RAISE EXCEPTION 'The new event time range overlaps with the existing event time range.';
      RETURN NULL;
    END IF;
  END LOOP;

  RETURN NEW; -- Возвращаем NEW, чтобы разрешить операцию
END;
$function$
;

-- Permissions

ALTER FUNCTION public.check_event_update_overlap() OWNER TO postgres;
GRANT ALL ON FUNCTION public.check_event_update_overlap() TO postgres;

-- DROP FUNCTION public.check_room_name_unique();

CREATE OR REPLACE FUNCTION public.check_room_name_unique()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    room_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO room_count
    FROM rooms
    WHERE room_name = NEW.room_name;

    IF room_count > 0 THEN
        RAISE EXCEPTION 'Комната с таким названием уже существует';
    END IF;

    RETURN NEW;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.check_room_name_unique() OWNER TO postgres;
GRANT ALL ON FUNCTION public.check_room_name_unique() TO postgres;

-- DROP FUNCTION public.delete_events_on_room_delete();

CREATE OR REPLACE FUNCTION public.delete_events_on_room_delete()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    DELETE FROM events
    WHERE room_id = OLD.id;
    RETURN OLD;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.delete_events_on_room_delete() OWNER TO postgres;
GRANT ALL ON FUNCTION public.delete_events_on_room_delete() TO postgres;


-- Permissions

GRANT ALL ON SCHEMA public TO pg_database_owner;
GRANT USAGE ON SCHEMA public TO public;