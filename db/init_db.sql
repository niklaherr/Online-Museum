SET timezone = 'Europe/Berlin';

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    isadmin BOOLEAN DEFAULT FALSE,
    security_question VARCHAR(255),
    security_answer TEXT
);


CREATE TABLE item (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    entered_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    image BYTEA,
    description TEXT,
    category VARCHAR(100),
    isprivate BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE item_list (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    entered_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
    isprivate BOOLEAN DEFAULT FALSE,
    main_image BYTEA,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE item_itemlist (
    id SERIAL PRIMARY KEY,
    item_list_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    CONSTRAINT fk_item_list FOREIGN KEY (item_list_id)
        REFERENCES item_list(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_item FOREIGN KEY (item_id)
        REFERENCES item(id)
        ON DELETE CASCADE,
    CONSTRAINT unique_item_itemlist UNIQUE (item_list_id, item_id)
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    entered_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    element_id INTEGER,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE contact_form (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    submitted_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'new' -- Options: 'new', 'in_progress', 'completed'
);

CREATE TABLE editorial (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    entered_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE item_editorial (
    id SERIAL PRIMARY KEY,
    editorial_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    CONSTRAINT fk_editorial FOREIGN KEY (editorial_id)
        REFERENCES editorial(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_item FOREIGN KEY (item_id)
        REFERENCES item(id)
        ON DELETE CASCADE,
    CONSTRAINT unique_item_editorial UNIQUE (editorial_id, item_id)
);