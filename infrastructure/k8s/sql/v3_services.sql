
INSERT INTO rdv.services (id, name, description, duration_minutes, price, status)
SELECT gen_random_uuid(), 'Consultation generale', 'Consultation initiale et diagnostic', 30, 50000, 'Actif'
WHERE NOT EXISTS (SELECT 1 FROM rdv.services WHERE name = 'Consultation generale');

INSERT INTO rdv.services (id, name, description, duration_minutes, price, status)
SELECT gen_random_uuid(), 'Detartrage', 'Detartrage et nettoyage dentaire complet', 45, 80000, 'Actif'
WHERE NOT EXISTS (SELECT 1 FROM rdv.services WHERE name = 'Detartrage');

INSERT INTO rdv.services (id, name, description, duration_minutes, price, status)
SELECT gen_random_uuid(), 'Blanchiment', 'Blanchiment dentaire professionnel', 60, 150000, 'Actif'
WHERE NOT EXISTS (SELECT 1 FROM rdv.services WHERE name = 'Blanchiment');

INSERT INTO rdv.services (id, name, description, duration_minutes, price, status)
SELECT gen_random_uuid(), 'Implant dentaire', 'Pose d''implant dentaire', 120, 500000, 'Actif'
WHERE NOT EXISTS (SELECT 1 FROM rdv.services WHERE name = 'Implant dentaire');

INSERT INTO rdv.services (id, name, description, duration_minutes, price, status)
SELECT gen_random_uuid(), 'Orthodontie', 'Consultation et suivi orthodontique', 60, 200000, 'Actif'
WHERE NOT EXISTS (SELECT 1 FROM rdv.services WHERE name = 'Orthodontie');

INSERT INTO rdv.services (id, name, description, duration_minutes, price, status)
SELECT gen_random_uuid(), 'Urgence', 'Consultation dentaire en urgence', 30, 100000, 'Actif'
WHERE NOT EXISTS (SELECT 1 FROM rdv.services WHERE name = 'Urgence');
