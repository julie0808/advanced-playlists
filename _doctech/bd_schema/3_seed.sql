-- Seed shared records identified by stable unique codes.
-- Run this after 2_schema.sql while connected to the "fancyt" database.

BEGIN;

-- This playlist ID is hard-coded in client/src/app/videos/video.service.ts.
INSERT INTO playlist (id, title, is_youtube)
VALUES (
    'PLwgftAdEcD4rXHmDdFTFI8Hch3BfWBQIt',
    'K-Pop',
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Assign stable codes to existing shared tag roots without relying on their IDs.
UPDATE tag
SET unique_code = 'artist'
WHERE tag_id = (
    SELECT tag_id
    FROM tag
    WHERE parent_tag_id = 0 AND title = 'Artists'
    ORDER BY tag_id
    LIMIT 1
)
AND unique_code IS NULL;

UPDATE tag
SET unique_code = 'music_genre'
WHERE tag_id = (
    SELECT tag_id
    FROM tag
    WHERE parent_tag_id = 0 AND title = 'Music Genre'
    ORDER BY tag_id
    LIMIT 1
)
AND unique_code IS NULL;

INSERT INTO tag (
    title,
    parent_tag_id,
    color,
    description,
    playlist_id,
    is_shared,
    unique_code
)
VALUES (
    'Artists',
    0,
    '#777777',
    NULL,
    NULL,
    TRUE,
    'artist'
)
ON CONFLICT DO NOTHING;

INSERT INTO tag (
    title,
    parent_tag_id,
    color,
    description,
    playlist_id,
    is_shared,
    unique_code
)
VALUES (
    'Music Genre',
    0,
    '#777777',
    NULL,
    NULL,
    TRUE,
    'music_genre'
)
ON CONFLICT DO NOTHING;

COMMIT;
