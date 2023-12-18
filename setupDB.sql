-- THIS SCRIPT IS USED ONCE TO CREATE THE TABLE IN PROD DB
-- I used the "pg_dump -U [userName] -f setupDB.sql --schema-only Ranking_App_DB" command

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Element; Type: TABLE; Schema: public; Owner: mickael
--

CREATE TABLE public."Element" (
    "Id" uuid NOT NULL,
    "Name" text,
    "Image" text,
    "Type" integer NOT NULL,
    "TemplateModelId" uuid
);

--
-- Name: RankedElements; Type: TABLE; Schema: public; Owner: mickael
--

CREATE TABLE public."RankedElements" (
    "ElementId" uuid NOT NULL,
    "TierId" uuid NOT NULL,
    "Position" integer NOT NULL,
    "TierlistModelId" uuid
);

--
-- Name: Templates; Type: TABLE; Schema: public; Owner: mickael
--

CREATE TABLE public."Templates" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "UserId" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL
);

--
-- Name: Tierlists; Type: TABLE; Schema: public; Owner: mickael
--

CREATE TABLE public."Tierlists" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "TemplateId" uuid NOT NULL,
    "UserId" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL
);

--
-- Name: Tiers; Type: TABLE; Schema: public; Owner: mickael
--

CREATE TABLE public."Tiers" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "Rank" integer NOT NULL,
    "TemplateModelId" uuid
);

--
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: mickael
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);

--
-- Name: Element PK_Element; Type: CONSTRAINT; Schema: public; Owner: mickael
--

ALTER TABLE ONLY public."Element"
    ADD CONSTRAINT "PK_Element" PRIMARY KEY ("Id");


--
-- Name: RankedElements PK_RankedElements; Type: CONSTRAINT; Schema: public; Owner: mickael
--

ALTER TABLE ONLY public."RankedElements"
    ADD CONSTRAINT "PK_RankedElements" PRIMARY KEY ("ElementId");


--
-- Name: Templates PK_Templates; Type: CONSTRAINT; Schema: public; Owner: mickael
--

ALTER TABLE ONLY public."Templates"
    ADD CONSTRAINT "PK_Templates" PRIMARY KEY ("Id");


--
-- Name: Tierlists PK_Tierlists; Type: CONSTRAINT; Schema: public; Owner: mickael
--

ALTER TABLE ONLY public."Tierlists"
    ADD CONSTRAINT "PK_Tierlists" PRIMARY KEY ("Id");


--
-- Name: Tiers PK_Tiers; Type: CONSTRAINT; Schema: public; Owner: mickael
--

ALTER TABLE ONLY public."Tiers"
    ADD CONSTRAINT "PK_Tiers" PRIMARY KEY ("Id");


--
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: mickael
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- Name: IX_Element_TemplateModelId; Type: INDEX; Schema: public; Owner: mickael
--

CREATE INDEX "IX_Element_TemplateModelId" ON public."Element" USING btree ("TemplateModelId");


--
-- Name: IX_RankedElements_TierlistModelId; Type: INDEX; Schema: public; Owner: mickael
--

CREATE INDEX "IX_RankedElements_TierlistModelId" ON public."RankedElements" USING btree ("TierlistModelId");


--
-- Name: IX_Tiers_TemplateModelId; Type: INDEX; Schema: public; Owner: mickael
--

CREATE INDEX "IX_Tiers_TemplateModelId" ON public."Tiers" USING btree ("TemplateModelId");


--
-- Name: Element FK_Element_Templates_TemplateModelId; Type: FK CONSTRAINT; Schema: public; Owner: mickael
--

ALTER TABLE ONLY public."Element"
    ADD CONSTRAINT "FK_Element_Templates_TemplateModelId" FOREIGN KEY ("TemplateModelId") REFERENCES public."Templates"("Id");


--
-- Name: RankedElements FK_RankedElements_Tierlists_TierlistModelId; Type: FK CONSTRAINT; Schema: public; Owner: mickael
--

ALTER TABLE ONLY public."RankedElements"
    ADD CONSTRAINT "FK_RankedElements_Tierlists_TierlistModelId" FOREIGN KEY ("TierlistModelId") REFERENCES public."Tierlists"("Id");


--
-- Name: Tiers FK_Tiers_Templates_TemplateModelId; Type: FK CONSTRAINT; Schema: public; Owner: mickael
--

ALTER TABLE ONLY public."Tiers"
    ADD CONSTRAINT "FK_Tiers_Templates_TemplateModelId" FOREIGN KEY ("TemplateModelId") REFERENCES public."Templates"("Id");


--
-- PostgreSQL database dump complete
--

