CREATE TABLE Category (
    category_id INT PRIMARY KEY,
    category TEXT
);

CREATE TABLE Item (
    item_id INT PRIMARY KEY,
    name TEXT,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
);

CREATE TABLE Date (
    date DATE PRIMARY KEY
);

CREATE TABLE Price (
    date DATE,
    item_id INT,
    price REAL,
    PRIMARY KEY (date, item_id),
    FOREIGN KEY (date) REFERENCES Date(date),
    FOREIGN KEY (item_id) REFERENCES Item(item_id)
);

CREATE TABLE Weather (
    date DATE PRIMARY KEY,
    avg_temp REAL,
    rainfall REAL,
    sunlight REAL,
    FOREIGN KEY (date) REFERENCES Date(date)
);

CREATE TABLE Volume (
    date DATE,
    item_id INT,
    quantity REAL,
    PRIMARY KEY (date, item_id),
    FOREIGN KEY (date) REFERENCES Date(date),
    FOREIGN KEY (item_id) REFERENCES Item(item_id)
);

CREATE TABLE User (
    user_id INT PRIMARY KEY,
    nickname TEXT
);

CREATE TABLE ViewLog (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    item TEXT,
    viewed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Review (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    item TEXT,
    date DATE,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE raw_all (
  PRCE_REG_YMD DATE,
  PDLT_CODE INT,
  PDLT_NM TEXT,
  AMNT_RAIN FLOAT,
  AVG_TEMP_C FLOAT,
  total_SunL FLOAT,
  Quantity FLOAT,
  PDLT_PRCE FLOAT,
  Category TEXT
);

INSERT IGNORE INTO Category (category_id, category)
SELECT DISTINCT
  CASE Category
    WHEN '뿌리채소' THEN 1
    WHEN '엽채류' THEN 2
    WHEN '열매채소' THEN 3
    WHEN '채소' THEN 4
  END AS category_id,
  Category
FROM raw_all;

INSERT IGNORE INTO Item (item_id, name, category_id)
SELECT DISTINCT
  PDLT_CODE,
  PDLT_NM,
  CASE Category
    WHEN '뿌리채소' THEN 1
    WHEN '엽채류' THEN 2
    WHEN '열매채소' THEN 3
    WHEN '채소' THEN 4
  END AS category_id
FROM raw_all;

INSERT IGNORE INTO Date (date)
SELECT DISTINCT PRCE_REG_YMD FROM raw_all;

INSERT INTO Price (date, item_id, price)
SELECT PRCE_REG_YMD, PDLT_CODE, PDLT_PRCE FROM raw_all;

INSERT IGNORE INTO Weather (date, avg_temp, rainfall, sunlight)
SELECT DISTINCT PRCE_REG_YMD, AVG_TEMP_C, AMNT_RAIN, total_SunL
FROM raw_all;

INSERT INTO Volume (date, item_id, quantity)
SELECT PRCE_REG_YMD, PDLT_CODE, Quantity FROM raw_all;

ALTER TABLE review
ADD CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES user(user_id);

ALTER TABLE viewlog
ADD CONSTRAINT fk_viewlog_user FOREIGN KEY (user_id) REFERENCES user(user_id);
