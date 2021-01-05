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
