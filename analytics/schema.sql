CREATE TABLE IF NOT EXISTS page_views (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ts          INTEGER NOT NULL,
    path        TEXT    NOT NULL,
    referrer    TEXT,
    country     TEXT,
    city        TEXT,
    ua_browser  TEXT,
    ua_os       TEXT,
    ua_device   TEXT,
    session_id  TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_page_views_ts      ON page_views(ts);
CREATE INDEX IF NOT EXISTS idx_page_views_path    ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);
