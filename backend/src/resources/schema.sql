CREATE TABLE IF NOT EXISTS users (
    id        INTEGER  PRIMARY KEY GENERATED ALWAYS AS IDENTITY
  , username  TEXT     UNIQUE                                    NOT NULL
  , password  TEXT                                               NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    user_id  INTEGER      REFERENCES users (id)
  , token    TEXT         UNIQUE                  NOT NULL
  , date     TIMESTAMPTZ  UNIQUE                  NOT NULL
);

CREATE TABLE IF NOT EXISTS folders (
    id                INTEGER  PRIMARY KEY GENERATED ALWAYS AS IDENTITY
  , user_id           INTEGER  REFERENCES users (id)                      NOT NULL
  , name              TEXT                                                NOT NULL
  , parent_folder_id  INTEGER  REFERENCES folders (id) ON DELETE CASCADE
  , UNIQUE (user_id, name)
);

CREATE TABLE IF NOT EXISTS feeds (
    id           INTEGER  PRIMARY KEY GENERATED ALWAYS AS IDENTITY
  , user_id      INTEGER  REFERENCES users (id)                     NOT NULL
  , folder_id    INTEGER  REFERENCES folders (id)
  , url          TEXT                                               NOT NULL
  , title        TEXT                                               NOT NULL
  , link         TEXT                                               NOT NULL
  , description  TEXT                                               NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
    id           INTEGER      PRIMARY KEY GENERATED ALWAYS AS IDENTITY
  , feed_id      INTEGER      REFERENCES feeds (id) ON DELETE CASCADE  NOT NULL
  , guid         TEXT                                                  NOT NULL
  , title        TEXT                                                  NOT NULL
  , description  TEXT                                                  NOT NULL
  , link         TEXT                                                  NOT NULL
  , date         TIMESTAMPTZ                                           NOT NULL
  , UNIQUE (feed_id, guid)
);
