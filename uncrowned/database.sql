CREATE DATABASE IF NOT EXISTS uncrowned_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE uncrowned_db;

CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(80)  NOT NULL,
  email      VARCHAR(191) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  age        TINYINT UNSIGNED NOT NULL,
  role       ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  token      VARCHAR(100) PRIMARY KEY,
  user_id    INT,
  username   VARCHAR(80),
  role       VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS products (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(191) NOT NULL,
  category   VARCHAR(60)  NOT NULL,
  price      INT UNSIGNED NOT NULL,
  stock      INT UNSIGNED DEFAULT NULL,
  sizes      JSON,
  image      TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  order_num        VARCHAR(20)  NOT NULL UNIQUE,
  user_id          INT          NOT NULL,
  subtotal         INT UNSIGNED NOT NULL,
  shipping         INT UNSIGNED NOT NULL DEFAULT 150,
  total            INT UNSIGNED NOT NULL,
  payment_method   VARCHAR(20)  NOT NULL,
  status           ENUM('pending','out_for_delivery','completed','cancelled') NOT NULL DEFAULT 'pending',
  address          JSON,
  rated            TINYINT(1)   NOT NULL DEFAULT 0,
  rating           TINYINT UNSIGNED,
  rating_comment   TEXT,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  order_id   INT          NOT NULL,
  product_id INT,
  name       VARCHAR(191) NOT NULL,
  category   VARCHAR(60),
  size       VARCHAR(10),
  qty        INT UNSIGNED NOT NULL DEFAULT 1,
  price      INT UNSIGNED NOT NULL,
  image      TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_addresses (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  fname      VARCHAR(80),
  lname      VARCHAR(80),
  phone      VARCHAR(20),
  street     VARCHAR(255),
  city       VARCHAR(100),
  province   VARCHAR(100),
  zip        VARCHAR(10),
  region     VARCHAR(60),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT IGNORE INTO products (id, name, category, price, sizes, image) VALUES
(1,  'Uncrowned Signature Shirt',             'shirts',  1200, '["S","M","L","XL","2XL"]', 'https://image2url.com/r2/default/images/1772616627489-ca85cae5-e9e3-4104-9c86-eed7f1c1f95a.png'),
(2,  'Premium Crewneck Shirt',                'shirts',  2800, '["S","M","L","XL","2XL"]', 'https://image2url.com/r2/default/images/1772616781321-dc5096d1-b4b1-47e9-9843-07573b357930.png'),
(3,  'U Cant See Me - Cena Tribute',          'shirts',  4500, '["S","M","L","XL","2XL"]', 'https://image2url.com/r2/default/images/1772616833059-bcd3948a-7c37-4d31-97c6-3feba9ee504b.png'),
(4,  'Premium Crewneck Shirt',                'shirts',  1500, '["S","M","L","XL","2XL"]', 'https://image2url.com/r2/default/images/1772616910426-eff84a2f-325c-48fe-b520-2c73db79f33e.png'),
(5,  'Crewneck Shirt - White',                'shirts',  3200, '["S","M","L","XL","2XL"]', 'https://image2url.com/r2/default/images/1772616926529-99357e25-a78d-4036-9c7d-004abb0914fc.png'),
(6,  'Signature Denim Pants',                 'pants',   1500, '["S","M","L","XL","2XL"]', 'https://image2url.com/r2/default/images/1772687296130-88262a7a-5fe6-4152-9207-8d2db21469f5.png'),
(7,  'Baggy Jeans Pants',                     'pants',   2500, '["S","M","L","XL","2XL"]', 'https://image2url.com/r2/default/images/1772687493366-18a16328-2aca-4f31-b434-68009c34dbda.png'),
(8,  'Gothic Retro Spider - Baggy Jeans',     'pants',   2100, '["S","M","L","XL","2XL"]', 'https://image2url.com/r2/default/images/1772687632857-3958a437-db9d-4a98-8346-7c572adc2de5.png'),
(9,  '2125 - Divine Sweats',                  'pants',   1300, '["S","M","L","XL","2XL"]', 'https://image2url.com/r2/default/images/1772687674047-b56301ed-dbde-4bf3-acfc-2bc698bdfd56.png'),
(10, 'Aonga Y2k Sweatpants',                  'pants', 1300, '["S","M","L","XL","2XL"]', 'https://image2url.com/r2/default/images/1772687697510-5beab4ad-3b58-4355-a2b3-26b2d3d3d383.png'),
(11, 'Vielseitige Herbst-Windbreaker Jacket', 'jackets', 1500, '["S","M","L","XL","2XL"]', 'https://image2url.com/r2/default/images/1772687951776-b553f020-c392-44ed-bea1-944d2892746c.png'),
(12, 'POOPMOOM Y2k Jacket',                   'jackets', 1000, '["S","M","L","XL","2XL"]', 'https://image2url.com/r2/default/images/1772688023426-eb7e157e-eb84-4d55-8935-37d0190a9b7c.png'),
(13, 'Japanese Zip Up Hoodie Patagonia',      'jackets', 1600, '["S","M","L","XL","2XL"]', 'https://image2url.com/r2/default/images/1772688071488-95b3b0fa-ccb6-4313-a409-bff8d0d85ea1.png');