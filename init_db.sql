SET timezone = 'Europe/Berlin';

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE item (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    entered_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    image BYTEA,
    description TEXT,
    category VARCHAR(100),
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