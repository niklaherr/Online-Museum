-- Setze Zeitzone
SET timezone = 'Europe/Berlin';

-- Benutzer
INSERT INTO users (username, password, isadmin, security_question, security_answer)
VALUES 
('adminuser', '$2b$10$cAFNNcm1WnTwFbNU2sAHAOrGcSxJqrsJYMCzItaHelV7KuORv60VC', TRUE, 'Familienname der Mutter?', '$2b$10$czEkB4Hj0D9fUnZC8xt1sOZQZAw/zzuh/npMG5vX78CeWamViZqg2'), -- id = 1
('alice', 'hashedpassword_alice', FALSE, 'Geburtsstadt?', 'Berlin'),    -- id = 2
('bob', 'hashedpassword_bob', FALSE, 'Lieblingsfilm?', 'Inception'),    -- id = 3
('carol', 'hashedpassword_carol', FALSE, 'Erster Haustiername?', 'Milo'); -- id = 4

-- Items von Alice
INSERT INTO item (user_id, title, description, category, isprivate, image)
VALUES
(2, 'Vintage Kamera', 'Eine alte Canon Kamera.', 'Elektronik', FALSE, pg_read_binary_file('/docker-entrypoint-initdb.d/image1.jpeg')),
(2, 'Reisepasshülle', 'Handgemacht aus Leder.', 'Accessoires', TRUE, pg_read_binary_file('/docker-entrypoint-initdb.d/image2.jpeg'));

-- Items von Bob
INSERT INTO item (user_id, title, description, category, image)
VALUES
(3, 'Mountainbike', '26 Zoll, guter Zustand.', 'Sport', pg_read_binary_file('/docker-entrypoint-initdb.d/image3.jpeg')),
(3, 'Campingzelt', '2-Personen Zelt.', 'Outdoor', pg_read_binary_file('/docker-entrypoint-initdb.d/image4.jpeg'));

-- Items von Carol
INSERT INTO item (user_id, title, description, category, isprivate, image)
VALUES
(4, 'Gitarrentasche', 'Robust und wasserdicht.', 'Musik', FALSE, pg_read_binary_file('/docker-entrypoint-initdb.d/image5.jpeg'));

-- Item-Listen
INSERT INTO item_list (title, description, user_id, main_image)
VALUES
('Reiseausstattung', 'Alles für den Urlaub.', 2, pg_read_binary_file('/docker-entrypoint-initdb.d/image6.jpeg')), -- id = 1
('Outdoor Gear', 'Meine Campingausrüstung.', 3, pg_read_binary_file('/docker-entrypoint-initdb.d/image7.jpeg'));  -- id = 2

-- Item-ItemList Verknüpfung
INSERT INTO item_itemlist (item_list_id, item_id)
VALUES 
(1, 1), -- Kamera
(1, 2), -- Reisepasshülle
(2, 3), -- Mountainbike
(2, 4); -- Zelt

-- Aktivitäten
INSERT INTO activities (category, type, element_id, user_id)
VALUES 
('item', 'create', 1, 2),
('item_list', 'create', 1, 2),
('item', 'update', 3, 3),
('item', 'create', 5, 4);

-- Kontaktformular
INSERT INTO contact_form (name, email, subject, message)
VALUES 
('Max Mustermann', 'max@example.com', 'Problem beim Login', 'Ich kann mich nicht anmelden.'),
('Lisa Müller', 'lisa@example.com', 'Frage zur Privatsphäre', 'Wer kann meine Items sehen?');

-- Editorials
INSERT INTO editorial (title, description)
VALUES 
('Top Reise-Gadgets 2025', 'Unsere Auswahl der besten Reisebegleiter.'),
('Outdoor-Tipps für Anfänger', 'So gelingt das erste Abenteuer.');

-- Editorial-Item Verknüpfung
INSERT INTO item_editorial (editorial_id, item_id)
VALUES 
(1, 1), -- Kamera
(2, 4); -- Zelt
