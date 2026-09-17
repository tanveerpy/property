CREATE DATABASE my_dream_home;
USE my_dream_home;

CREATE TABLE office (
  office_id INT PRIMARY KEY,
  state VARCHAR(50),
  city VARCHAR(50),
  zip VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(50),
  website VARCHAR(255)
);

CREATE TABLE agent (
  agent_id INT PRIMARY KEY,
  fname VARCHAR(50) NOT NULL,
  lname VARCHAR(50),
  email VARCHAR(50),
  phoneno VARCHAR(20) NOT NULL,
  city VARCHAR(50),
  street VARCHAR(50),
  postalcode VARCHAR(10),
  commision DECIMAL(5,2),
  NOP_sale INT,
  total_saleAmount DECIMAL(10,2),
  office_id INT,
  FOREIGN KEY (office_id) REFERENCES office(office_id)
);

CREATE TABLE buyers (
  buyer_id INT PRIMARY KEY,
  fname VARCHAR(50) NOT NULL,
  lname VARCHAR(50),
  phoneno VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  agent_id INT,
  FOREIGN KEY (agent_id) REFERENCES agent(agent_id)
);

CREATE TABLE sellers (
  seller_id INT PRIMARY KEY NOT NULL,
  fname VARCHAR(50),
  lname VARCHAR(50),
  phoneno VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  agent_id INT,
  UPI_ID VARCHAR(50),
  FOREIGN KEY (agent_id) REFERENCES agent(agent_id)
);

CREATE TABLE properties (
  pid INT PRIMARY KEY,
  price DECIMAL(10,2),
  status VARCHAR(20),
  number_of_bedroom INT,
  seller_id INT,
  yoc INT,
  city VARCHAR(50),
  street VARCHAR(50),
  postalcode VARCHAR(10),
  agent_id INT,
  FOREIGN KEY (seller_id) REFERENCES sellers(seller_id),
  FOREIGN KEY (agent_id) REFERENCES agent(agent_id)
);

CREATE TABLE transaction (
  transaction_id INT PRIMARY KEY,
  pid INT,
  seller_id INT,
  buyer_id INT,
  transaction_date DATE,
  transaction_amount DECIMAL(10,2),
  commission DECIMAL(10,2),
  agent_id INT,
  FOREIGN KEY (pid) REFERENCES properties(pid),
  FOREIGN KEY (seller_id) REFERENCES sellers(seller_id),
  FOREIGN KEY (buyer_id) REFERENCES buyers(buyer_id),
  FOREIGN KEY (agent_id) REFERENCES agent(agent_id)
);

CREATE TABLE agentlogin(
  username VARCHAR(50) NOT NULL,
  password VARCHAR(20) PRIMARY KEY
);

CREATE TABLE Admin(
  username VARCHAR(20) PRIMARY KEY,
  password VARCHAR(20)
);

CREATE TABLE officelogin(
  username VARCHAR(20),
  password VARCHAR(10)
);

INSERT INTO officelogin VALUES('@gaurav2','2101073');

INSERT INTO Admin (username,password) VALUES('@gaurav1','2101072'),('@gaurav2','2101073'),('@kkr','2101100'),('@aps','2101028');

INSERT INTO office VALUES(125,'Punjab','Lahore','54000','+92-42-35789000','lahore.office@propertylele.com','www.propertylele.com');

INSERT INTO agent (agent_id, fname,lname,email,phoneno,city,street,postalcode, commision, NOP_sale, total_saleAmount,office_id)
    -> VALUES
    -> (1, 'Amit', 'Sharma', 'amit.sharma@gmail.com', '+92-300-9876543', 'Karachi', 'Clifton Block 2', '75600', 0.50, 0,0.00,125),
    -> (2, 'Neha', 'Gupta', 'neha.gupta@hotmail.com', '+92-321-9765432', 'Islamabad', 'Sector F-7 Markaz', '44000', 0.50, 0,0.00,125),
    -> (3, 'Rajesh', 'Patel', 'rajesh.patel@yahoo.com', '+92-333-9554321', 'Lahore', 'Gulberg III', '54660', 0.50, 0,0.00,125),
    -> (4, 'Priya', 'Singh', 'priya.singh@gmail.com', '+92-312-9712345', 'Rawalpindi', 'Bahria Town Phase 4', '46000', 0.50,0,0.00,125),
    -> (5, 'Ravi', 'Kumar', 'ravi.kumar@yahoo.com', '+92-301-9898765', 'Karachi', 'DHA Phase 5', '75500', 0.50,0,0.00,125),
    -> (6, 'Anjali', 'Joshi', 'anjali.joshi@gmail.com', '+92-345-9823456', 'Faisalabad', 'Kohinoor City', '38000', 0.50,0,0.00,125),
    -> (7, 'Sanjay', 'Chauhan', 'sanjay.chauhan@hotmail.com', '+92-302-9876543', 'Lahore', 'Mall Road Cantt', '54000', 0.50,0,0.00,125),
    -> (8, 'Smita', 'Desai', 'smita.desai@yahoo.com', '+92-322-9765432', 'Islamabad', 'Sector F-10 Markaz', '44000', 0.50,0,0.00,125),
    -> (9, 'Vivek', 'Shah', 'vivek.shah@gmail.com', '+92-334-9554321', 'Lahore', 'DHA Phase 6', '54792', 0.50,0,0.00,125),
    -> (10, 'Kavita', 'Reddy', 'kavita.reddy@gmail.com', '+92-313-9712345', 'Peshawar', 'Hayatabad Phase 3', '25000', 0.50,0,0.00,125),
    -> (11, 'Amar', 'Singh', 'amar.singh@yahoo.com', '+92-303-9876543', 'Multan', 'Gulgasht Colony', '60000', 0.50,0,0.00,125),
    -> (12, 'Sarika', 'Choudhary', 'sarika.choudhary@gmail.com', '+92-323-9765432', 'Rawalpindi', 'Chaklala Scheme 3', '46000', 0.50,0,0.00,125),
    -> (13, 'Rahul', 'Goyal', 'rahul.goyal@hotmail.com', '+92-335-9554321', 'Islamabad', 'Sector E-7', '44000', 0.50,0,0.00,125),
    -> (14, 'Mohan', 'Gupta', 'mohan.gupta@gmail.com', '+92-304-9876543', 'Lahore', 'Johar Town', '54782', 0.50,0,0.00,125),
    -> (15, 'Sneha', 'Verma', 'sneha.verma@hotmail.com', '+92-324-9765432', 'Karachi', 'Bath Island, Clifton', '75530', 0.50, 0,0.00,125),
    -> (16, 'Anil', 'Shukla', 'anil.shukla@yahoo.com', '+92-336-9554321', 'Faisalabad', 'Peoples Colony', '38000', 0.50,0,0.00,125),
    -> (17, 'Nisha', 'Pandey', 'nisha.pandey@gmail.com', '+92-314-9712345', 'Lahore', 'Cantt Officers Colony', '54810', 0.50,0,0.00,125),
    -> (18, 'Rohan', 'Nair', 'rohan.nair@yahoo.com', '+92-305-9898765', 'Karachi', 'Shahrah-e-Faisal', '75350', 0.50, 0,0.00,125),
    -> (19, 'Kavita', 'Sharma', 'kavita.sharma@gmail.com', '+92-346-9823456', 'Karachi', 'PECHS Block 6', '75400', 0.50,0,0.00,125),
    -> (20, 'Raj', 'Kapoor', 'raj.kapoor@hotmail.com', '+92-306-9876543', 'Islamabad', 'Sector F-11 Markaz', '44000', 0.50,0,0.00,125);
INSERT INTO buyers (buyer_id, fname,lname,phoneno,email, agent_id)
    -> VALUES
    -> (1, 'Aryan', 'Sharma', '+92-300-8765432', 'aryan.sharma@example.com', 5),
    -> (2, 'Aditi', 'Singh', '+92-321-7654321', 'aditi.singh@example.com', 8),
    -> (3, 'Vikas', 'Patil', '+92-333-6543210', 'vikas.patil@example.com', 11),
    -> (4, 'Kavya', 'Gupta', '+92-312-5432109', 'kavya.gupta@example.com', 3),
    -> (5,'Nikhil', 'Rao', '+92-301-4321098', 'nikhil.rao@example.com', 15),
    -> (6, 'Riya', 'Nair', '+92-345-3210987', 'riya.nair@example.com', 19),
    -> (7, 'Aman', 'Deshpande', '+92-302-2109876', 'aman.deshpande@example.com', 4),
    -> (8, 'Sana', 'Khan', '+92-322-1098765', 'sana.khan@example.com', 10),
    -> (9, 'Amit', 'Shukla', '+92-334-0987654', 'amit.shukla@example.com', 7),
    -> (10, 'Kriti', 'Mishra', '+92-313-9876543', 'kriti.mishra@example.com', 12),
    -> (11, 'Hitesh', 'Singhal', '+92-303-8765432', 'hitesh.singhal@example.com', 2),
    -> (12, 'Nidhi', 'Kumar', '+92-323-7654321', 'nidhi.kumar@example.com', 1),
    -> (13, 'Vivek', 'Thakur', '+92-335-6543210', 'vivek.thakur@example.com', 6),
    -> (14, 'Jaya', 'Pandey', '+92-304-5432109', 'jaya.pandey@example.com', 18),
    -> (15 ,'Rahul', 'Shah', '+92-324-4321098', 'rahul.shah@example.com', 16),
    -> (16, 'Anjali', 'Verma', '+92-336-3210987', 'anjali.verma@example.com', 20),
    -> (17, 'Aryan', 'Naidu', '+92-314-2109876', 'aryan.naidu@example.com', 9),
    -> (18, 'Neha', 'Raj', '+92-305-1098765', 'neha.raj@example.com', 17),
    -> (19, 'Rohan', 'Goyal', '+92-346-0987654', 'rohan.goyal@example.com', 13),
    -> (20, 'Isha', 'Chopra', '+92-306-9876543', 'isha.chopra@example.com', 14);
INSERT INTO sellers (seller_id,fname,lname,phoneNo,email, agent_id)
    -> VALUES
    -> (1, 'Vikram', 'Sinha', '+92-300-1122334', 'vikram.sinha@example.com', 7),
    -> (2, 'Priya', 'Gupta', '+92-321-2233445', 'priya.gupta@example.com', 19),
    -> (3, 'Aman', 'Chopra', '+92-333-3344556', 'aman.chopra@example.com', 4),
    -> (4, 'Sneha', 'Sharma', '+92-312-4455667', 'sneha.sharma@example.com', 12),
    -> (5,'Rohan', 'Verma', '+92-301-5566778', 'rohan.verma@example.com', 9),
    -> (6, 'Nisha', 'Reddy', '+92-345-6677889', 'nisha.reddy@example.com', 1),
    -> (7, 'Varun', 'Mehra', '+92-302-7788990', 'varun.mehra@example.com', 15),
    -> (8, 'Amit', 'Saxena', '+92-322-8899001', 'amit.saxena@example.com', 5),
    -> (9, 'Ayesha', 'Singh', '+92-334-9900112', 'ayesha.singh@example.com', 20),
    -> (10, 'Ankit', 'Patel', '+92-313-0011223', 'ankit.patel@example.com', 14),
    -> (11, 'Divya', 'Kumar', '+92-303-1234567', 'divya.kumar@example.com', 17),
    -> (12, 'Rajesh', 'Yadav', '+92-323-2345678', 'rajesh.yadav@example.com', 11),
    -> (13, 'Rhea', 'Shah', '+92-335-3456789', 'rhea.shah@example.com', 8),
    -> (14, 'Karan', 'Malhotra', '+92-304-4567890', 'karan.malhotra@example.com', 6),
    -> (15 ,'Sarika', 'Nair', '+92-324-5678901', 'sarika.nair@example.com', 18),
    -> (16, 'Gaurav', 'Jain', '+92-336-6789012', 'gaurav.jain@example.com', 16),
    -> (17, 'Mehak', 'Garg', '+92-314-7890123', 'mehak.garg@example.com', 3),
    -> (18, 'Aryan', 'Singhal', '+92-305-8901234', 'aryan.singhal@example.com', 10),
    -> (19, 'Ishika', 'Mishra', '+92-346-9012345', 'ishika.mishra@example.com', 2),
    -> (20, 'Sujata', 'Das', '+92-306-0123456', 'sujata.das@example.com', 13);
INSERT INTO properties (pid, price, status,number_of_bedroom, seller_id, yoc,city,street,postalcode, agent_id)
    -> VALUES
    -> (1, 5000000.00, 'sell', 2, 4, 2010, 'Karachi', 'Clifton Block 2', '75600', 1),
    -> (2, 20000.00, 'rent', 1, 6, 2021, 'Lahore', 'Gulberg III', '54660', 3),
    -> (3, 7500000.00, 'sell', 3, 5, 2005, 'Islamabad', 'Sector F-7/2', '44000', 2),
    -> (4, 30000.00, 'rent', 2, 7, 2015, 'Rawalpindi', 'Bahria Town Phase 4', '46000', 4),
    -> (5, 4500000.00, 'sell', 1, 10, 2022, 'Faisalabad', 'Kohinoor City', '38000', 6),
    -> (6, 18000.00, 'rent', 1, 8, 2016, 'Karachi', 'DHA Phase 5', '75500', 15),
    -> (7, 9000000.00, 'sell',3, 3, 2008, 'Lahore', 'DHA Phase 6', '54792', 17),
    -> (8, 35000.00, 'rent',2, 15, 2014, 'Islamabad', 'Sector F-10/3', '44000', 9),
    -> (9, 65000.00, 'rent',3, 9, 2023, 'Rawalpindi', 'Chaklala Scheme 3', '46000', 2),
    -> (10, 13000.00, 'rent',1, 1, 2020, 'Karachi', 'PECHS Block 6', '75400', 19),
    -> (11, 4200000.00, 'sell',2, 18, 2013, 'Lahore', 'Model Town', '54700', 17),
    -> (12, 28000.00, 'rent',2, 13, 2019, 'Peshawar', 'Hayatabad Phase 3', '25000', 5),
    -> (13, 8500000.00, 'sell',3, 20, 2011, 'Islamabad', 'Sector E-7', '44000', 6),
    -> (14, 32000.00, 'rent',2, 19, 2017, 'Multan', 'Gulgasht Colony', '60000', 16),
    -> (15, 5500000.00, 'sell',2, 11, 2009, 'Lahore', 'Johar Town Phase 2', '54782', 14),
    -> (16, 20000.00, 'rent',1, 2, 2021, 'Karachi', 'Gulshan-e-Iqbal Block 5', '75300', 19),
    -> (17, 7000000.00, 'sell',3, 12, 2007, 'Islamabad', 'Sector F-11/1', '44000', 17),
    -> (18, 1250000.00, 'sell',2, 13, 2018, 'Karachi', 'Shahrah-e-Faisal', '75350', 15),
    -> (19, 7000.00, 'rent',1, 7, 2015, 'Rawalpindi', 'Saddar Cantt', '46000', 14),
    -> (20, 11000.00, 'rent',3, 20, 2020, 'Lahore', 'Mall Road Cantt', '54000', 9);
INSERT INTO properties (pid, price, status,number_of_bedroom, seller_id, yoc,city,street,postalcode, agent_id)
    -> VALUES
    -> (21, 950000, 'sell', 2, 2, 2005, 'Karachi', 'DHA Phase 8 Seafront', '75500', 1),
    -> (22, 15000, 'rent', 1, 5, 2010, 'Islamabad', 'Sector G-11', '44000', 2),
    -> (23, 1000000, 'sell', 3, 3, 2009, 'Faisalabad', 'Peoples Colony No 1', '38000', 6),
    -> (24, 25000, 'rent', 2, 2, 2018, 'Peshawar', 'University Town', '25000', 4),
    -> (25, 750000, 'sell', 3, 1, 2003, 'Lahore', 'Cantt Officers Colony', '54810', 9),
    -> (26, 20000, 'rent', 1, 4, 2015, 'Karachi', 'Bahria Town Precinct 1', '75340', 15),
    -> (27, 600000, 'sell', 2, 6, 2010, 'Islamabad', 'Sector I-8/2', '44000', 14),
    -> (28, 30000, 'rent', 3, 3, 2016, 'Multan', 'Bosan Road', '60000', 6),
    -> (29, 500000, 'sell', 1, 5, 2005, 'Rawalpindi', 'Peshawar Road', '46000', 16),
    -> (30, 18000, 'rent', 2, 1, 2012, 'Lahore', 'Wapda Town', '54770', 17),
    -> (31, 800000, 'sell', 3, 4, 2008, 'Karachi', 'Clifton Block 4', '75600', 19),
    -> (32, 35000, 'rent', 1, 6, 2019, 'Islamabad', 'Sector F-8/3', '44000', 14),
    -> (33, 1200000, 'sell', 4, 2, 2010, 'Faisalabad', 'Madina Town', '38000', 6),
    -> (34, 40000, 'rent', 3, 3, 2014, 'Peshawar', 'Warsak Road', '25000', 4),
    -> (35, 650000, 'sell', 2, 1, 2004, 'Lahore', 'DHA Phase 4', '54792', 17),
    -> (36, 22000, 'rent', 1, 5, 2017, 'Karachi', 'North Nazimabad Block B', '74700', 1),
    -> (37, 900000, 'sell', 3, 6, 2011, 'Islamabad', 'Blue Area', '44000', 14),
    -> (38, 40000, 'rent', 2, 4, 2015, 'Quetta', 'Jinnah Town', '87300', 6),
    -> (39, 550000, 'sell', 2, 2, 2007, 'Rawalpindi', 'Satellite Town', '46300', 16),
    -> (40, 20000, 'rent', 1, 1, 2013, 'Lahore', 'Bahria Town Sector C', '53720', 3);
INSERT INTO properties (pid, price, status, number_of_bedroom, seller_id, yoc, city, street, postalcode, agent_id)
    -> VALUES
    -> (41, 235000.00, 'sell', 2, 6, 2015, 'Islamabad', 'Sector D-12', '44000', 14),
    -> (42, 12500.00, 'rent', 1, 3, 2019, 'Karachi', 'DHA Phase 2', '75500', 19),
    -> (43, 510000.00, 'sell', 4, 8, 2010, 'Faisalabad', 'Canal Road', '38000', 6),
    -> (44, 15000.00, 'rent', 2, 5, 2018, 'Multan', 'DHA Multan Sector A', '60000', 16),
    -> (45, 180000.00, 'sell', 3, 10, 2017, 'Lahore', 'Gulberg II', '54660', 9),
    -> (46, 17000.00, 'rent', 1, 1, 2019, 'Karachi', 'KDA Scheme 1', '75350', 1),
    -> (47, 300000.00, 'sell', 5, 9, 2016, 'Islamabad', 'Sector F-6/4', '44000', 2),
    -> (48, 12000.00, 'rent', 2, 4, 2020, 'Peshawar', 'Hayatabad Phase 5', '25000', 6),
    -> (49, 250000.00, 'sell', 3, 7, 2013, 'Rawalpindi', 'Bahria Town Safari Valley', '46000', 4),
    -> (50, 19000.00, 'rent', 1, 2, 2021, 'Lahore', 'DHA Phase 3', '54792', 3),
    -> (51, 410000.00, 'sell', 4, 5, 2015, 'Islamabad', 'Sector E-11', '44000', 14),
    -> (52, 13000.00, 'rent', 1, 1, 2022, 'Karachi', 'Bath Island, Clifton', '75530', 19),
    -> (53, 550000.00, 'sell', 5, 10, 2012, 'Gujranwala', 'DC Colony', '52250', 6),
    -> (54, 16000.00, 'rent', 2, 6, 2017, 'Quetta', 'Cantt Road', '87300', 16),
    -> (55, 270000.00, 'sell', 3, 8, 2014, 'Lahore', 'Garden Town', '54600', 17),
    -> (56, 20000.00, 'rent', 1, 3, 2020, 'Karachi', 'DHA Phase 7', '75500', 1),
    -> (57, 350000.00, 'sell', 4, 9, 2011, 'Islamabad', 'Sector B-17', '44000', 2),
    -> (58, 11000.00, 'rent', 2, 4, 2021, 'Sialkot', 'Cantt Area', '51310', 6);
ALTER TABLE sellers ADD UPI_ID VARCHAR(50);
INSERT INTO agentlogin (username, password)
    -> VALUES
    ->     ('@Amit', 'Amit01'),
    ->     ('@Neha', 'Neha02'),
    ->     ('@Rajesh', 'Rajesh03'),
    ->     ('@Priya', 'Priya04'),
    ->     ('@Ravi', 'Ravi05'),
    ->     ('@Anjali', 'Anjali06'),
    ->     ('@Sanjay', 'Sanjay07'),
    ->     ('@Smita', 'Smita08'),
    ->     ('@Vivek', 'Vivek09'),
    ->     ('@Kavita1', 'Kavita10'),
    ->     ('@Amar', 'Amar11'),
    ->     ('@Sarika', 'Sarika12'),
    ->     ('@Rahul', 'Rahul13'),
    ->     ('@Mohan', 'Mohan14'),
    ->     ('@Sneha', 'Sneha15'),
    ->     ('@Anil', 'Anil16'),
    ->     ('@Nisha', 'Nisha17'),
    ->     ('@Rohan', 'Rohan18'),
    ->     ('@Kavita2', 'Kavita19'),
    ->     ('@Raj', 'Raj20');
ALTER TABLE properties
    -> ADD year_of_sale YEAR;
ALTER TABLE properties
    -> ADD year_of_listing YEAR(4) DEFAULT 2022;
UPDATE properties p
    -> INNER JOIN transaction t ON p.pid = t.pid
    -> SET p.year_of_sale = YEAR(t.transaction_date);
CREATE TRIGGER update_property_status
AFTER INSERT  ON transaction
FOR EACH ROW
BEGIN
  UPDATE properties
  SET status = 'sold'
  WHERE pid = NEW.pid;
END;

CREATE TRIGGER insert_property_status
AFTER UPDATE ON transaction
FOR EACH ROW
BEGIN
  UPDATE properties
  SET status = 'sold'
  WHERE pid = NEW.pid;
END;
CREATE TRIGGER update_agent_stats
AFTER UPDATE ON transaction
FOR EACH ROW
BEGIN
  UPDATE agent
  SET NOP_sale = NOP_sale + 1,
      total_saleAmount = total_saleAmount + NEW.transaction_amount
  WHERE agent_id = NEW.agent_id;
END;

CREATE TRIGGER insert_agent_stats
AFTER INSERT ON transaction
FOR EACH ROW
BEGIN
  UPDATE agent
  SET NOP_sale = NOP_sale + 1,
      total_saleAmount = total_saleAmount + NEW.transaction_amount
  WHERE agent_id = NEW.agent_id;
END;
CREATE TRIGGER update_property_year_of_sale
AFTER UPDATE ON transaction
FOR EACH ROW
BEGIN
  UPDATE properties
  SET year_of_sale = YEAR(NEW.transaction_date)
  WHERE pid = NEW.pid;
END;

CREATE TRIGGER insert_property_year_of_sale
AFTER INSERT ON transaction
FOR EACH ROW
BEGIN
  UPDATE properties
  SET year_of_sale = YEAR(NEW.transaction_date)
  WHERE pid = NEW.pid;
END;

UPDATE sellers SET UPI_ID = 'vikram.sinha@raast' WHERE seller_id = 1;
UPDATE sellers SET UPI_ID = 'priya.gupta@nayapay' WHERE seller_id = 2;
UPDATE sellers SET UPI_ID = 'aman.chopra@sadapay' WHERE seller_id = 3;
UPDATE sellers SET UPI_ID = 'sneha.sharma@jazzcash' WHERE seller_id = 4;
UPDATE sellers SET UPI_ID = 'rohan.verma@easypaisa' WHERE seller_id = 5;
UPDATE sellers SET UPI_ID = 'nisha.reddy@raast' WHERE seller_id = 6;
UPDATE sellers SET UPI_ID = 'varun.mehra@nayapay' WHERE seller_id = 7;
UPDATE sellers SET UPI_ID = 'amit.saxena@sadapay' WHERE seller_id = 8;
UPDATE sellers SET UPI_ID = 'ayesha.singh@jazzcash' WHERE seller_id = 9;
UPDATE sellers SET UPI_ID = 'ankit.patel@easypaisa' WHERE seller_id = 10;
UPDATE sellers SET UPI_ID = 'divya.kumar@raast' WHERE seller_id = 11;
UPDATE sellers SET UPI_ID = 'rajesh.yadav@nayapay' WHERE seller_id = 12;
UPDATE sellers SET UPI_ID = 'rhea.shah@sadapay' WHERE seller_id = 13;
UPDATE sellers SET UPI_ID = 'karan.malhotra@jazzcash' WHERE seller_id = 14;
UPDATE sellers SET UPI_ID = 'sarika.nair@easypaisa' WHERE seller_id = 15;
UPDATE sellers SET UPI_ID = 'gaurav.jain@raast' WHERE seller_id = 16;
UPDATE sellers SET UPI_ID = 'mehak.garg@nayapay' WHERE seller_id = 17;
UPDATE sellers SET UPI_ID = 'aryan.singhal@sadapay' WHERE seller_id = 18;
UPDATE sellers SET UPI_ID = 'ishika.mishra@jazzcash' WHERE seller_id = 19;
UPDATE sellers SET UPI_ID = 'sujata.das@easypaisa' WHERE seller_id = 20;

