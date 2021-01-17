CREATE TABLE IF NOT EXISTS users (
    id        INTEGER  PRIMARY KEY  GENERATED ALWAYS AS IDENTITY,
    username  TEXT     UNIQUE       NOT NULL,
    password  TEXT                  NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    user_id  INTEGER      REFERENCES users (id),
    token    TEXT         UNIQUE                  NOT NULL,
    date     TIMESTAMPTZ  UNIQUE                  NOT NULL
);

CREATE TABLE IF NOT EXISTS folders (
    id                INTEGER  PRIMARY KEY               GENERATED ALWAYS AS IDENTITY,
    user_id           INTEGER  REFERENCES users (id)     NOT NULL,
    name              TEXT     UNIQUE                    NOT NULL,
    parent_folder_id  INTEGER  REFERENCES folders (id)              ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feeds (
    id           INTEGER  PRIMARY KEY              GENERATED ALWAYS AS IDENTITY,
    user_id      INTEGER  REFERENCES users (id)    NOT NULL,
    folder_id    INTEGER  REFERENCES folders (id),
    url          TEXT                              NOT NULL,
    title        TEXT                              NOT NULL,
    link         TEXT                              NOT NULL,
    description  TEXT                              NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
    id           INTEGER      PRIMARY KEY,
    feed_id      INTEGER      REFERENCES feeds (id)  NOT NULL,
    title        TEXT                                NOT NULL,
    link         TEXT                                NOT NULL,
    description  TEXT                                NOT NULL,
    date         TIMESTAMPTZ                         NOT NULL
);
