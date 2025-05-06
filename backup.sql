--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.4 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: calculate_distance(double precision, double precision, double precision, double precision); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_distance(lat1 double precision, lon1 double precision, lat2 double precision, lon2 double precision) RETURNS double precision
    LANGUAGE plpgsql
    AS $$
DECLARE
    earth_radius double precision := 6371;
    dlat double precision;
    dlon double precision;
    a double precision;
    c double precision;
BEGIN
    dlat := radians(lat2 - lat1);
    dlon := radians(lon2 - lon1);
    a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    RETURN earth_radius * c;
END;
$$;


ALTER FUNCTION public.calculate_distance(lat1 double precision, lon1 double precision, lat2 double precision, lon2 double precision) OWNER TO postgres;

--
-- Name: calculate_order_delivery_time(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_order_delivery_time() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    sender_lat double precision;
    sender_lon double precision;
    receiver_lat double precision;
    receiver_lon double precision;
    distance double precision;
    distance_factor double precision := 60;
    base_time INTEGER := 259200; -- 3 дня в секундах
    workload BOOLEAN;
BEGIN
    SELECT latitude, longitude INTO sender_lat, sender_lon
    FROM parcel_delivery_places
    WHERE id = NEW.sender_address;

    IF NEW.receiver_point_id IS NOT NULL THEN
        SELECT latitude, longitude INTO receiver_lat, receiver_lon
        FROM parcel_delivery_places
        WHERE id = NEW.receiver_point_id;
    ELSIF NEW.receiver_address_id IS NOT NULL THEN
        SELECT t.latitude, t.longitude INTO receiver_lat, receiver_lon
        FROM user_addresses ua
        JOIN towns t ON ua.town_id = t.id
        WHERE ua.id = NEW.receiver_address_id;
    ELSE
        RAISE EXCEPTION 'Receiver location not specified';
    END IF;

    distance := calculate_distance(sender_lat, sender_lon, receiver_lat, receiver_lon);

    workload := (SELECT COUNT(*) FROM orders WHERE delivered = false) > 1000;

    NEW.approximate_delivery_date := NOW()
        + (base_time || ' seconds')::interval
        + (distance * distance_factor || ' seconds')::interval
        + ((NEW.order_type = 2)::INT * 10800 || ' seconds')::interval
        + (workload::INT * 86400 || ' seconds')::interval;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.calculate_order_delivery_time() OWNER TO postgres;

--
-- Name: calculate_order_price(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_order_price() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    sender_lat double precision;
    sender_lon double precision;
    receiver_lat double precision;
    receiver_lon double precision;
    distance double precision;
    base_price double precision := 50;
    weight_factor double precision := 10;
    size_factor double precision := 0.5;
BEGIN
    SELECT latitude, longitude INTO sender_lat, sender_lon
    FROM parcel_delivery_places
    WHERE id = NEW.sender_address;

    IF NEW.receiver_point_id IS NOT NULL THEN
        SELECT latitude, longitude INTO receiver_lat, receiver_lon
        FROM parcel_delivery_places
        WHERE id = NEW.receiver_point_id;
    ELSIF NEW.receiver_address_id IS NOT NULL THEN
        SELECT towns.latitude, towns.longitude INTO receiver_lat, receiver_lon
        FROM towns join user_addresses on user_addresses.town_id = towns.id 
        WHERE user_addresses.id = NEW.receiver_address_id;
    ELSE
        RAISE EXCEPTION 'Receiver location not specified';
    END IF;

    distance := calculate_distance(sender_lat, sender_lon, receiver_lat, receiver_lon);

    NEW.price := base_price
               + (distance * 1)
               + (NEW.order_type = 2)::INT + 500
               + (SELECT weight FROM package_types WHERE id = NEW.package_id) * weight_factor
               + ((SELECT length + height + width FROM package_types WHERE id = NEW.package_id) / 100.0) * size_factor;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.calculate_order_price() OWNER TO postgres;

--
-- Name: check_delivery_status_fn(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_delivery_status_fn() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.approximate_delivery_date < NOW() AND NOT NEW.delivered THEN
        UPDATE orders
        SET delivered = true
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.check_delivery_status_fn() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: order_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_types (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.order_types OWNER TO postgres;

--
-- Name: order_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_types_id_seq OWNER TO postgres;

--
-- Name: order_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_types_id_seq OWNED BY public.order_types.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    order_type integer NOT NULL,
    sender_address integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_last_name character varying(50) NOT NULL,
    receiver_first_name character varying(50) NOT NULL,
    receiver_middle_name character varying(50),
    receiver_point_id integer,
    receiver_address_id integer,
    package_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    approximate_delivery_date timestamp without time zone,
    price numeric(10,2),
    delivered boolean DEFAULT false
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: package_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.package_types (
    id integer NOT NULL,
    name character varying(30) NOT NULL,
    length integer NOT NULL,
    height integer NOT NULL,
    width integer NOT NULL,
    weight integer NOT NULL
);


ALTER TABLE public.package_types OWNER TO postgres;

--
-- Name: package_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.package_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.package_types_id_seq OWNER TO postgres;

--
-- Name: package_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.package_types_id_seq OWNED BY public.package_types.id;


--
-- Name: parcel_delivery_places; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parcel_delivery_places (
    id integer NOT NULL,
    town_id integer NOT NULL,
    latitude numeric(9,6) NOT NULL,
    longitude numeric(9,6) NOT NULL
);


ALTER TABLE public.parcel_delivery_places OWNER TO postgres;

--
-- Name: parcel_delivery_places_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parcel_delivery_places_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.parcel_delivery_places_id_seq OWNER TO postgres;

--
-- Name: parcel_delivery_places_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parcel_delivery_places_id_seq OWNED BY public.parcel_delivery_places.id;


--
-- Name: towns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.towns (
    id integer NOT NULL,
    name character varying(127) NOT NULL,
    latitude numeric(9,6) NOT NULL,
    longitude numeric(9,6) NOT NULL
);


ALTER TABLE public.towns OWNER TO postgres;

--
-- Name: towns_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.towns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.towns_id_seq OWNER TO postgres;

--
-- Name: towns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.towns_id_seq OWNED BY public.towns.id;


--
-- Name: user_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_addresses (
    id integer NOT NULL,
    town_id integer,
    user_id integer NOT NULL,
    street character varying(50) NOT NULL,
    entrance integer,
    apartment_number integer,
    floor integer,
    intercom_code character varying(20)
);


ALTER TABLE public.user_addresses OWNER TO postgres;

--
-- Name: user_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_addresses_id_seq OWNER TO postgres;

--
-- Name: user_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_addresses_id_seq OWNED BY public.user_addresses.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    last_name character varying(50) NOT NULL,
    first_name character varying(50) NOT NULL,
    middle_name character varying(50),
    passport_serial character varying(10) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: order_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_types ALTER COLUMN id SET DEFAULT nextval('public.order_types_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: package_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_types ALTER COLUMN id SET DEFAULT nextval('public.package_types_id_seq'::regclass);


--
-- Name: parcel_delivery_places id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parcel_delivery_places ALTER COLUMN id SET DEFAULT nextval('public.parcel_delivery_places_id_seq'::regclass);


--
-- Name: towns id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.towns ALTER COLUMN id SET DEFAULT nextval('public.towns_id_seq'::regclass);


--
-- Name: user_addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses ALTER COLUMN id SET DEFAULT nextval('public.user_addresses_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: order_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_types (id, name) FROM stdin;
1	Delivery to Point
2	Delivery to Address
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, order_type, sender_address, sender_id, receiver_last_name, receiver_first_name, receiver_middle_name, receiver_point_id, receiver_address_id, package_id, created_at, approximate_delivery_date, price, delivered) FROM stdin;
10	1	2	1	kiyantsev	dimetrii	makedon	\N	4	4	2025-05-04 02:53:10.393022	2025-05-07 13:26:12.324997	6183.36	f
11	1	2	1	kiyantsev	dimetrii	\N	\N	4	4	2025-05-04 02:54:02.004661	2025-05-07 13:27:03.936636	6183.36	f
\.


--
-- Data for Name: package_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.package_types (id, name, length, height, width, weight) FROM stdin;
4	Small Box	30	20	15	500
5	Large Box	50	40	30	2000
\.


--
-- Data for Name: parcel_delivery_places; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parcel_delivery_places (id, town_id, latitude, longitude) FROM stdin;
2	2	59.934300	30.335100
4	1	50.920000	73.133000
\.


--
-- Data for Name: towns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.towns (id, name, latitude, longitude) FROM stdin;
1	Moscow	55.755800	37.617600
2	Saint Petersburg	59.934300	30.335100
3	Moscow	55.755800	37.617600
4	Saint Petersburg	59.934300	30.335100
5	Ессентуки	44.044440	42.860560
\.


--
-- Data for Name: user_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_addresses (id, town_id, user_id, street, entrance, apartment_number, floor, intercom_code) FROM stdin;
4	1	1	vokzl	3	55	2	23
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, last_name, first_name, middle_name, passport_serial, email, password_hash, created_at) FROM stdin;
1	Ivanov	Ivan	Ivanovich	1234567890	ivanov@mail.com	hashed_password_1	2025-05-02 18:39:40.468014
7	aaa	bbb	\N	3333333333	laddlad@mail.ru	pass_hash_4	2025-05-02 20:52:34.575107
\.


--
-- Name: order_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_types_id_seq', 3, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 11, true);


--
-- Name: package_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.package_types_id_seq', 5, true);


--
-- Name: parcel_delivery_places_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parcel_delivery_places_id_seq', 6, true);


--
-- Name: towns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.towns_id_seq', 7, true);


--
-- Name: user_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_addresses_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: order_types order_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_types
    ADD CONSTRAINT order_types_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: package_types package_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_types
    ADD CONSTRAINT package_types_pkey PRIMARY KEY (id);


--
-- Name: parcel_delivery_places parcel_delivery_places_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parcel_delivery_places
    ADD CONSTRAINT parcel_delivery_places_pkey PRIMARY KEY (id);


--
-- Name: towns towns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.towns
    ADD CONSTRAINT towns_pkey PRIMARY KEY (id);


--
-- Name: user_addresses user_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: orders check_delivery_status; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_delivery_status AFTER UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.check_delivery_status_fn();


--
-- Name: orders trigger_calculate_order_delivery_time; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_calculate_order_delivery_time BEFORE INSERT OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.calculate_order_delivery_time();


--
-- Name: orders trigger_calculate_price; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_calculate_price BEFORE INSERT OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.calculate_order_price();


--
-- Name: orders orders_order_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_type_fkey FOREIGN KEY (order_type) REFERENCES public.order_types(id) ON DELETE CASCADE;


--
-- Name: orders orders_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.package_types(id) ON DELETE CASCADE;


--
-- Name: orders orders_receiver_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_receiver_address_id_fkey FOREIGN KEY (receiver_address_id) REFERENCES public.user_addresses(id) ON DELETE CASCADE;


--
-- Name: orders orders_receiver_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_receiver_point_id_fkey FOREIGN KEY (receiver_point_id) REFERENCES public.parcel_delivery_places(id) ON DELETE CASCADE;


--
-- Name: orders orders_sender_address_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_sender_address_fkey FOREIGN KEY (sender_address) REFERENCES public.parcel_delivery_places(id) ON DELETE CASCADE;


--
-- Name: orders orders_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: parcel_delivery_places parcel_delivery_places_town_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parcel_delivery_places
    ADD CONSTRAINT parcel_delivery_places_town_id_fkey FOREIGN KEY (town_id) REFERENCES public.towns(id) ON DELETE CASCADE;


--
-- Name: user_addresses user_addresses_town_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_town_id_fkey FOREIGN KEY (town_id) REFERENCES public.towns(id) ON DELETE CASCADE;


--
-- Name: user_addresses user_addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

