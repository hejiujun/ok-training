CREATE DATABASE IF NOT EXISTS erc_test DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
use erc_test
create table transfer_info(
   id INT NOT NULL AUTO_INCREMENT,
   from_addr VARCHAR(225) NOT NULL,
   to_addr VARCHAR(225) NOT NULL,
   token_id VARCHAR(225) NOT NULL,
   PRIMARY KEY (id)
);