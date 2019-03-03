CREATE TABLE apikeys
(
  access_key bit(160),
  secretkey bit(320)
) INHERITS (users);
