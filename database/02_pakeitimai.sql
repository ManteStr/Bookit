-- =====================================================================
-- BookIT: 02_pakeitimai.sql
-- ---------------------------------------------------------------------
-- DB pakeitimai virš database/db_bookit.sql (kurį jau turite).
--
-- KAIP PALEISTI (kiekviena iš jūsų, pas save):
--   phpMyAdmin -> kairėje pasirinkti DB `db_bookit` -> viršuje "Import"
--   -> pasirinkti šį failą -> "Import".
--
-- Failas saugus paleisti kelis kartus (naudoja IF EXISTS / IF NOT EXISTS),
-- todėl nieko nesugadinsite, jei paleisite dar kartą.
-- Reikalauja MariaDB (XAMPP ją ir turi: 10.4.x). Standartiniame MySQL
-- "ADD COLUMN IF NOT EXISTS" nepalaikomas.
-- =====================================================================

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- 1) kambariai
--    * zemelapio_x / zemelapio_y nebereikalingi: žemėlapį piešia SVG,
--      kambarys surišamas pagal kambario_nr (SVG id = "room-<kambario_nr>").
--    * kompiuteriu_sk jau pašalintas (kompiuteriai skaičiuojami per
--      kambario_iranga); IF EXISTS tik tam atvejui, jei kas turi seną DB.
--    * busena: 'aktyvus' arba 'remontuojamas'.
-- ---------------------------------------------------------------------
ALTER TABLE `kambariai`
  DROP COLUMN IF EXISTS `zemelapio_x`,
  DROP COLUMN IF EXISTS `zemelapio_y`,
  DROP COLUMN IF EXISTS `kompiuteriu_sk`;

ALTER TABLE `kambariai`
  MODIFY `busena` VARCHAR(20) NOT NULL DEFAULT 'aktyvus';

UPDATE `kambariai` SET `busena` = 'aktyvus' WHERE `busena` = '';

-- ---------------------------------------------------------------------
-- 2) iranga: pavadinimai, kurie bus rodomi vartotojui
-- ---------------------------------------------------------------------
UPDATE `iranga` SET `pavadinimas` = 'Interaktyvi lenta' WHERE `pavadinimas` = 'Int_lenta';
UPDATE `iranga` SET `pavadinimas` = 'Rašomoji lenta'    WHERE `pavadinimas` = 'Ras_lenta';

-- ---------------------------------------------------------------------
-- 3) bibliotekos
--    * rašybos klaida pavadinime
--    * Centrinės bibliotekos žemėlapio SVG kelias (failas guli
--      frontend/public/maps/). Kitų filialų žemėlapių dar nėra.
-- ---------------------------------------------------------------------
UPDATE `bibliotekos`
   SET `pavadinimas` = 'Architektūros fakulteto skaitykla'
 WHERE `pavadinimas` = 'Achitektūros fakulteto skaitykla';

UPDATE `bibliotekos`
   SET `zemelapio_url` = '/maps/Centrine-biblioteka.svg'
 WHERE `bibliotekos_id` = 1 AND `zemelapio_url` = '';

-- ---------------------------------------------------------------------
-- 4) vartotojai: administratorius gali užblokuoti paskyrą
--    (užblokuotas vartotojas nebegali prisijungti / rezervuoti)
-- ---------------------------------------------------------------------
ALTER TABLE `vartotojai`
  ADD COLUMN IF NOT EXISTS `uzblokuotas` TINYINT(1) NOT NULL DEFAULT 0 AFTER `role_id`;

-- ---------------------------------------------------------------------
-- 5) rezervacijos (naudosime kitame etape)
--    busena: 'nepatvirtinta' -> 'rezervuota' (paspaudus nuorodą laiške)
--            arba 'atsaukta'
--    * nepatvirtinta rezervacija laiko laiką iki galioja_iki
--      (sukūrimo momentas + 5 min.)
-- ---------------------------------------------------------------------
ALTER TABLE `rezervacijos`
  MODIFY `busena` VARCHAR(30) NOT NULL DEFAULT 'nepatvirtinta';

ALTER TABLE `rezervacijos`
  ADD COLUMN IF NOT EXISTS `pastaba`              VARCHAR(500) NULL AFTER `pabaigos_laikas`,
  ADD COLUMN IF NOT EXISTS `atsaukimo_priezastis` VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS `patvirtinimo_zetonas` CHAR(64)     NULL,
  ADD COLUMN IF NOT EXISTS `galioja_iki`          DATETIME     NULL;

-- Greitesnis užimtumo tikrinimas (kambarys + data + būsena) ir
-- unikalus patvirtinimo žetonas (keli NULL leidžiami).
CREATE INDEX IF NOT EXISTS `idx_rez_kambarys_data`
  ON `rezervacijos` (`kambario_id`, `data`, `busena`);

CREATE UNIQUE INDEX IF NOT EXISTS `ux_rez_zetonas`
  ON `rezervacijos` (`patvirtinimo_zetonas`);

-- ---------------------------------------------------------------------
-- Pastaba: rolės (Svecias, Admin, Vartotojas) jau yra Mantės dump'e.
-- Administratoriaus paskyrą sukuriate komanda (žr. api/README.md),
-- nes slaptažodžio hash negalima rašyti ranka į SQL.
-- ---------------------------------------------------------------------
