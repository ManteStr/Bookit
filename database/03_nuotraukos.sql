-- BookIT: 03 – kambarių nuotraukos
-- Importuokite per phpMyAdmin (db_bookit -> Import). Saugu paleisti kelis kartus.
-- Nuotraukos adresas saugomas stulpelyje kambariai.nuotraukos_url.
-- Vėliau galite jį pakeisti į savo failą, pvz. 'kambarys-220.jpg' (turi būti
-- frontend/public/images/rooms/ aplanke) arba į kitą pilną https:// adresą.

-- Centrinė biblioteka (bibliotekos_id = 1)
UPDATE kambariai SET nuotraukos_url = 'https://vilniustech.lt/wp-content/uploads/2025/12/Untitled-design-2025-12-11T110610.209-768x512.png?x37173'
 WHERE bibliotekos_id = 1 AND kambario_nr = '220';
UPDATE kambariai SET nuotraukos_url = 'https://vilniustech.lt/wp-content/uploads/2025/12/VilniusTECHBiblioteka202595of113-2-768x512.jpg?x37173'
 WHERE bibliotekos_id = 1 AND kambario_nr = '211';
UPDATE kambariai SET nuotraukos_url = 'https://vilniustech.lt/wp-content/uploads/2025/12/VilniusTECHBiblioteka202599of113-2-768x512.jpg?x37173'
 WHERE bibliotekos_id = 1 AND kambario_nr = '201A';
UPDATE kambariai SET nuotraukos_url = 'https://vilniustech.lt/wp-content/uploads/2025/12/Untitled-design-2025-12-15T093838.639-768x512.png?x37173'
 WHERE bibliotekos_id = 1 AND kambario_nr = '216';

-- Architektūros fakulteto skaitykla (bibliotekos_id = 2)
UPDATE kambariai SET nuotraukos_url = 'https://vilniustech.lt/wp-content/uploads/2025/12/Untitled-design-2025-12-15T123240.810-768x512.png?x37173'
 WHERE bibliotekos_id = 2 AND kambario_nr = 'T-1 1.15';

-- Jūreivystės mokslų skaitykla, Klaipėda (bibliotekos_id = 3)
UPDATE kambariai SET nuotraukos_url = 'https://vilniustech.lt/wp-content/uploads/2025/12/Untitled-design-2025-12-11T120006.333-768x512.png?x37173'
 WHERE bibliotekos_id = 3 AND kambario_nr = '1';
UPDATE kambariai SET nuotraukos_url = 'https://vilniustech.lt/wp-content/uploads/2025/12/Untitled-design-2025-12-11T115411.450-768x512.png?x37173'
 WHERE bibliotekos_id = 3 AND kambario_nr = '2';
