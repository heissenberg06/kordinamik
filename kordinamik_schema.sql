--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 15.13

-- Started on 2025-12-09 20:40:56

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 872 (class 1247 OID 16730)
-- Name: enum_dealer_applications_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_dealer_applications_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.enum_dealer_applications_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16524)
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    full_name character varying(100) NOT NULL,
    is_active boolean DEFAULT true,
    last_login timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16523)
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admins_id_seq OWNER TO postgres;

--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 216
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- TOC entry 227 (class 1259 OID 16588)
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    admin_id integer,
    action character varying(100) NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id integer,
    old_values jsonb,
    new_values jsonb,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16587)
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audit_logs_id_seq OWNER TO postgres;

--
-- TOC entry 3411 (class 0 OID 0)
-- Dependencies: 226
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- TOC entry 219 (class 1259 OID 16538)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16537)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 3412 (class 0 OID 0)
-- Dependencies: 218
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 229 (class 1259 OID 16939)
-- Name: dealer_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dealer_applications (
    id integer NOT NULL,
    company_name character varying(100) NOT NULL,
    company_title character varying(100) NOT NULL,
    tax_office character varying(100) NOT NULL,
    tax_id character varying(20) NOT NULL,
    trade_register character varying(50),
    website character varying(255),
    contact_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    mobile character varying(20),
    address text NOT NULL,
    city character varying(50) NOT NULL,
    district character varying(50),
    postal_code character varying(20),
    country character varying(50) DEFAULT 'Türkiye'::character varying NOT NULL,
    business_type character varying(50) NOT NULL,
    employee_count character varying(20),
    annual_revenue character varying(50),
    brands text,
    message text,
    status public.enum_dealer_applications_status DEFAULT 'pending'::public.enum_dealer_applications_status,
    approval_code character varying(20),
    approved_at timestamp with time zone,
    approved_by integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.dealer_applications OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16938)
-- Name: dealer_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dealer_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dealer_applications_id_seq OWNER TO postgres;

--
-- TOC entry 3413 (class 0 OID 0)
-- Dependencies: 228
-- Name: dealer_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dealer_applications_id_seq OWNED BY public.dealer_applications.id;


--
-- TOC entry 231 (class 1259 OID 16957)
-- Name: dealers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dealers (
    id integer NOT NULL,
    company_name character varying(100) NOT NULL,
    contact_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    password_hash character varying(255) NOT NULL,
    address text,
    tax_id character varying(20) NOT NULL,
    business_type character varying(100),
    is_active boolean DEFAULT true,
    last_login timestamp with time zone,
    approval_code character varying(20),
    application_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.dealers OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16956)
-- Name: dealers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dealers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dealers_id_seq OWNER TO postgres;

--
-- TOC entry 3414 (class 0 OID 0)
-- Dependencies: 230
-- Name: dealers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dealers_id_seq OWNED BY public.dealers.id;


--
-- TOC entry 223 (class 1259 OID 16564)
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    product_id integer NOT NULL,
    image_data bytea NOT NULL,
    image_name character varying(255),
    image_type character varying(50),
    is_primary boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16563)
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_images_id_seq OWNER TO postgres;

--
-- TOC entry 3415 (class 0 OID 0)
-- Dependencies: 222
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- TOC entry 221 (class 1259 OID 16547)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    category_id integer,
    name character varying(200) NOT NULL,
    model character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0,
    fuel_type character varying(50),
    features jsonb DEFAULT '{}'::jsonb,
    warranty_months integer,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    technical_details_image bytea,
    technical_details_image_type character varying(50),
    cover_photo bytea,
    cover_photo_type character varying(50)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16546)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 3416 (class 0 OID 0)
-- Dependencies: 220
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 225 (class 1259 OID 16579)
-- Name: token_blacklist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.token_blacklist (
    id integer NOT NULL,
    token character varying(500) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoked_at timestamp with time zone
);


ALTER TABLE public.token_blacklist OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16578)
-- Name: token_blacklist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.token_blacklist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.token_blacklist_id_seq OWNER TO postgres;

--
-- TOC entry 3417 (class 0 OID 0)
-- Dependencies: 224
-- Name: token_blacklist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.token_blacklist_id_seq OWNED BY public.token_blacklist.id;


--
-- TOC entry 3213 (class 2604 OID 16527)
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- TOC entry 3223 (class 2604 OID 16591)
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- TOC entry 3215 (class 2604 OID 16541)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 3224 (class 2604 OID 16942)
-- Name: dealer_applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealer_applications ALTER COLUMN id SET DEFAULT nextval('public.dealer_applications_id_seq'::regclass);


--
-- TOC entry 3227 (class 2604 OID 16960)
-- Name: dealers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealers ALTER COLUMN id SET DEFAULT nextval('public.dealers_id_seq'::regclass);


--
-- TOC entry 3220 (class 2604 OID 16567)
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- TOC entry 3216 (class 2604 OID 16550)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 3222 (class 2604 OID 16582)
-- Name: token_blacklist id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token_blacklist ALTER COLUMN id SET DEFAULT nextval('public.token_blacklist_id_seq'::regclass);


--
-- TOC entry 3230 (class 2606 OID 16536)
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- TOC entry 3232 (class 2606 OID 16532)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- TOC entry 3234 (class 2606 OID 16534)
-- Name: admins admins_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);


--
-- TOC entry 3244 (class 2606 OID 16595)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3236 (class 2606 OID 16545)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3246 (class 2606 OID 16950)
-- Name: dealer_applications dealer_applications_approval_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealer_applications
    ADD CONSTRAINT dealer_applications_approval_code_key UNIQUE (approval_code);


--
-- TOC entry 3248 (class 2606 OID 16948)
-- Name: dealer_applications dealer_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealer_applications
    ADD CONSTRAINT dealer_applications_pkey PRIMARY KEY (id);


--
-- TOC entry 3250 (class 2606 OID 16971)
-- Name: dealers dealers_approval_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT dealers_approval_code_key UNIQUE (approval_code);


--
-- TOC entry 3252 (class 2606 OID 16967)
-- Name: dealers dealers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT dealers_email_key UNIQUE (email);


--
-- TOC entry 3254 (class 2606 OID 16965)
-- Name: dealers dealers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT dealers_pkey PRIMARY KEY (id);


--
-- TOC entry 3256 (class 2606 OID 16969)
-- Name: dealers dealers_tax_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT dealers_tax_id_key UNIQUE (tax_id);


--
-- TOC entry 3240 (class 2606 OID 16572)
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- TOC entry 3238 (class 2606 OID 16557)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3242 (class 2606 OID 16586)
-- Name: token_blacklist token_blacklist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token_blacklist
    ADD CONSTRAINT token_blacklist_pkey PRIMARY KEY (id);


--
-- TOC entry 3259 (class 2606 OID 16596)
-- Name: audit_logs audit_logs_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3260 (class 2606 OID 16951)
-- Name: dealer_applications dealer_applications_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealer_applications
    ADD CONSTRAINT dealer_applications_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.admins(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3261 (class 2606 OID 16972)
-- Name: dealers dealers_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT dealers_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.dealer_applications(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3258 (class 2606 OID 16573)
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3257 (class 2606 OID 16558)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2025-12-09 20:40:56

--
-- PostgreSQL database dump complete
--

