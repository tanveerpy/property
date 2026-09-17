const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = path.join(__dirname, '..', 'real_estate.db');
let db = null;

function getDb() {
  if (!db) {
    db = new DatabaseSync(DB_PATH);
    initDatabase(db);
  }
  return db;
}

function initDatabase(database) {
  // Enable foreign keys
  database.exec('PRAGMA foreign_keys = ON;');

  // Create tables
  database.exec(`
    CREATE TABLE IF NOT EXISTS office (
      office_id INTEGER PRIMARY KEY,
      state TEXT,
      city TEXT,
      zip TEXT,
      phone TEXT,
      email TEXT,
      website TEXT
    );

    CREATE TABLE IF NOT EXISTS agent (
      agent_id INTEGER PRIMARY KEY,
      fname TEXT NOT NULL,
      lname TEXT,
      email TEXT,
      phoneno TEXT NOT NULL,
      city TEXT,
      street TEXT,
      postalcode TEXT,
      commision REAL DEFAULT 0.50,
      NOP_sale INTEGER DEFAULT 0,
      total_saleAmount REAL DEFAULT 0.0,
      office_id INTEGER,
      FOREIGN KEY (office_id) REFERENCES office(office_id)
    );

    CREATE TABLE IF NOT EXISTS buyers (
      buyer_id INTEGER PRIMARY KEY,
      fname TEXT NOT NULL,
      lname TEXT,
      phoneno TEXT NOT NULL,
      email TEXT,
      agent_id INTEGER,
      FOREIGN KEY (agent_id) REFERENCES agent(agent_id)
    );

    CREATE TABLE IF NOT EXISTS sellers (
      seller_id INTEGER PRIMARY KEY,
      fname TEXT,
      lname TEXT,
      phoneno TEXT NOT NULL,
      email TEXT,
      agent_id INTEGER,
      UPI_ID TEXT,
      FOREIGN KEY (agent_id) REFERENCES agent(agent_id)
    );

    CREATE TABLE IF NOT EXISTS properties (
      pid INTEGER PRIMARY KEY AUTOINCREMENT,
      price REAL NOT NULL,
      status TEXT CHECK(status IN ('sell', 'rent', 'sold')) DEFAULT 'sell',
      number_of_bedroom INTEGER NOT NULL,
      seller_id INTEGER,
      yoc INTEGER,
      city TEXT NOT NULL,
      street TEXT NOT NULL,
      postalcode TEXT,
      agent_id INTEGER,
      year_of_sale INTEGER,
      year_of_listing INTEGER DEFAULT 2024,
      title TEXT,
      image_url TEXT,
      property_type TEXT DEFAULT 'Apartment',
      FOREIGN KEY (seller_id) REFERENCES sellers(seller_id),
      FOREIGN KEY (agent_id) REFERENCES agent(agent_id)
    );

    CREATE TABLE IF NOT EXISTS transaction_records (
      transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
      pid INTEGER NOT NULL,
      seller_id INTEGER,
      buyer_id INTEGER NOT NULL,
      transaction_date TEXT NOT NULL,
      transaction_amount REAL NOT NULL,
      commission REAL NOT NULL,
      agent_id INTEGER NOT NULL,
      FOREIGN KEY (pid) REFERENCES properties(pid),
      FOREIGN KEY (seller_id) REFERENCES sellers(seller_id),
      FOREIGN KEY (buyer_id) REFERENCES buyers(buyer_id),
      FOREIGN KEY (agent_id) REFERENCES agent(agent_id)
    );

    CREATE TABLE IF NOT EXISTS admin_login (
      username TEXT PRIMARY KEY,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS agent_login (
      username TEXT PRIMARY KEY,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS office_login (
      username TEXT PRIMARY KEY,
      password TEXT NOT NULL
    );
  `);

  // Create triggers for business automation
  database.exec(`
    CREATE TRIGGER IF NOT EXISTS trg_close_property_sale
    AFTER INSERT ON transaction_records
    FOR EACH ROW
    BEGIN
      UPDATE properties
      SET status = 'sold',
          year_of_sale = CAST(strftime('%Y', NEW.transaction_date) AS INTEGER)
      WHERE pid = NEW.pid;

      UPDATE agent
      SET NOP_sale = NOP_sale + 1,
          total_saleAmount = total_saleAmount + NEW.transaction_amount
      WHERE agent_id = NEW.agent_id;
    END;
  `);

  // Check if initial data exists
  const countRow = database.prepare('SELECT COUNT(*) as count FROM office').get();
  if (countRow.count === 0) {
    seedInitialData(database);
  }
}

// Curated architectural photos matching cities and types
const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
];

function seedInitialData(database) {
  console.log('Seeding initial real estate database from my_dream_home.sql...');

  // Offices
  const insertOffice = database.prepare(`
    INSERT INTO office (office_id, state, city, zip, phone, email, website)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertOffice.run(125, 'Punjab', 'Lahore', '54000', '+92 42 3578 9000', 'lahore.office@propertylele.com', 'www.propertylele.com/lahore');
  insertOffice.run(126, 'Sindh', 'Karachi', '74000', '+92 21 3584 8800', 'karachi.central@propertylele.com', 'www.propertylele.com/karachi');
  insertOffice.run(127, 'Islamabad Capital Territory', 'Islamabad', '44000', '+92 51 2605 5500', 'islamabad@propertylele.com', 'www.propertylele.com/isb');
  insertOffice.run(128, 'Punjab', 'Rawalpindi', '46000', '+92 51 5560 9900', 'rawalpindi@propertylele.com', 'www.propertylele.com/rwp');

  // Admins & Logins
  const insertAdmin = database.prepare('INSERT INTO admin_login (username, password) VALUES (?, ?)');
  insertAdmin.run('@gaurav1', '2101072');
  insertAdmin.run('@gaurav2', '2101073');
  insertAdmin.run('@kkr', '2101100');
  insertAdmin.run('@aps', '2101028');
  insertAdmin.run('admin', 'admin123'); // Easy convenience admin login

  const insertOfficeLogin = database.prepare('INSERT INTO office_login (username, password) VALUES (?, ?)');
  insertOfficeLogin.run('@gaurav2', '2101073');
  insertOfficeLogin.run('office', 'office123');

  // Agents
  const agentsData = [
    [1, 'Amit', 'Sharma', 'amit.sharma@gmail.com', '+92-300-9876543', 'Karachi', 'Clifton Block 2', '75600', 0.50, 0, 0.0, 126],
    [2, 'Neha', 'Gupta', 'neha.gupta@hotmail.com', '+92-321-9765432', 'Islamabad', 'Sector F-7 Markaz', '44000', 0.50, 0, 0.0, 127],
    [3, 'Rajesh', 'Patel', 'rajesh.patel@yahoo.com', '+92-333-9554321', 'Lahore', 'Gulberg III', '54660', 0.50, 0, 0.0, 125],
    [4, 'Priya', 'Singh', 'priya.singh@gmail.com', '+92-312-9712345', 'Rawalpindi', 'Bahria Town Phase 4', '46000', 0.50, 0, 0.0, 128],
    [5, 'Ravi', 'Kumar', 'ravi.kumar@yahoo.com', '+92-301-9898765', 'Karachi', 'DHA Phase 5', '75500', 0.50, 0, 0.0, 126],
    [6, 'Anjali', 'Joshi', 'anjali.joshi@gmail.com', '+92-345-9823456', 'Faisalabad', 'Kohinoor City', '38000', 0.50, 0, 0.0, 125],
    [7, 'Sanjay', 'Chauhan', 'sanjay.chauhan@hotmail.com', '+92-302-9876543', 'Lahore', 'Mall Road Cantt', '54000', 0.50, 0, 0.0, 125],
    [8, 'Smita', 'Desai', 'smita.desai@yahoo.com', '+92-322-9765432', 'Islamabad', 'Sector F-10 Markaz', '44000', 0.50, 0, 0.0, 127],
    [9, 'Vivek', 'Shah', 'vivek.shah@gmail.com', '+92-334-9554321', 'Lahore', 'DHA Phase 6', '54792', 0.50, 0, 0.0, 125],
    [10, 'Kavita', 'Reddy', 'kavita.reddy@gmail.com', '+92-313-9712345', 'Peshawar', 'Hayatabad Phase 3', '25000', 0.50, 0, 0.0, 127],
    [11, 'Amar', 'Singh', 'amar.singh@yahoo.com', '+92-303-9876543', 'Multan', 'Gulgasht Colony', '60000', 0.50, 0, 0.0, 125],
    [12, 'Sarika', 'Choudhary', 'sarika.choudhary@gmail.com', '+92-323-9765432', 'Rawalpindi', 'Chaklala Scheme 3', '46000', 0.50, 0, 0.0, 128],
    [13, 'Rahul', 'Goyal', 'rahul.goyal@hotmail.com', '+92-335-9554321', 'Islamabad', 'Sector E-7', '44000', 0.50, 0, 0.0, 127],
    [14, 'Mohan', 'Gupta', 'mohan.gupta@gmail.com', '+92-304-9876543', 'Lahore', 'Johar Town', '54782', 0.50, 0, 0.0, 125],
    [15, 'Sneha', 'Verma', 'sneha.verma@hotmail.com', '+92-324-9765432', 'Karachi', 'Bath Island, Clifton', '75530', 0.50, 0, 0.0, 126],
    [16, 'Anil', 'Shukla', 'anil.shukla@yahoo.com', '+92-336-9554321', 'Faisalabad', 'Peoples Colony', '38000', 0.50, 0, 0.0, 125],
    [17, 'Nisha', 'Pandey', 'nisha.pandey@gmail.com', '+92-314-9712345', 'Lahore', 'Cantt Officers Colony', '54810', 0.50, 0, 0.0, 125],
    [18, 'Rohan', 'Nair', 'rohan.nair@yahoo.com', '+92-305-9898765', 'Karachi', 'Shahrah-e-Faisal', '75350', 0.50, 0, 0.0, 126],
    [19, 'Kavita', 'Sharma', 'kavita.sharma@gmail.com', '+92-346-9823456', 'Karachi', 'PECHS Block 6', '75400', 0.50, 0, 0.0, 126],
    [20, 'Raj', 'Kapoor', 'raj.kapoor@hotmail.com', '+92-306-9876543', 'Islamabad', 'Sector F-11 Markaz', '44000', 0.50, 0, 0.0, 127]
  ];

  const insertAgent = database.prepare(`
    INSERT INTO agent (agent_id, fname, lname, email, phoneno, city, street, postalcode, commision, NOP_sale, total_saleAmount, office_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  agentsData.forEach(a => insertAgent.run(...a));

  const agentLogins = [
    ['@Amit', 'Amit01'],
    ['@Neha', 'Neha02'],
    ['@Rajesh', 'Rajesh03'],
    ['@Priya', 'Priya04'],
    ['@Ravi', 'Ravi05'],
    ['@Anjali', 'Anjali06'],
    ['@Sanjay', 'Sanjay07'],
    ['@Smita', 'Smita08'],
    ['@Vivek', 'Vivek09'],
    ['@Kavita1', 'Kavita10'],
    ['@Amar', 'Amar11'],
    ['@Sarika', 'Sarika12'],
    ['@Rahul', 'Rahul13'],
    ['@Mohan', 'Mohan14'],
    ['@Sneha', 'Sneha15'],
    ['@Anil', 'Anil16'],
    ['@Nisha', 'Nisha17'],
    ['@Rohan', 'Rohan18'],
    ['@Kavita2', 'Kavita19'],
    ['@Raj', 'Raj20'],
    ['agent', 'agent123']
  ];

  const insertAgentLogin = database.prepare('INSERT OR IGNORE INTO agent_login (username, password) VALUES (?, ?)');
  agentLogins.forEach(([uname, pword]) => insertAgentLogin.run(uname, pword));

  // Buyers
  const buyersData = [
    [1, 'Aryan', 'Sharma', '+92-300-8765432', 'aryan.sharma@example.com', 5],
    [2, 'Aditi', 'Singh', '+92-321-7654321', 'aditi.singh@example.com', 8],
    [3, 'Vikas', 'Patil', '+92-333-6543210', 'vikas.patil@example.com', 11],
    [4, 'Kavya', 'Gupta', '+92-312-5432109', 'kavya.gupta@example.com', 3],
    [5, 'Nikhil', 'Rao', '+92-301-4321098', 'nikhil.rao@example.com', 15],
    [6, 'Riya', 'Nair', '+92-345-3210987', 'riya.nair@example.com', 19],
    [7, 'Aman', 'Deshpande', '+92-302-2109876', 'aman.deshpande@example.com', 4],
    [8, 'Sana', 'Khan', '+92-322-1098765', 'sana.khan@example.com', 10],
    [9, 'Amit', 'Shukla', '+92-334-0987654', 'amit.shukla@example.com', 7],
    [10, 'Kriti', 'Mishra', '+92-313-9876543', 'kriti.mishra@example.com', 12],
    [11, 'Hitesh', 'Singhal', '+92-303-8765432', 'hitesh.singhal@example.com', 2],
    [12, 'Nidhi', 'Kumar', '+92-323-7654321', 'nidhi.kumar@example.com', 1],
    [13, 'Vivek', 'Thakur', '+92-335-6543210', 'vivek.thakur@example.com', 6],
    [14, 'Jaya', 'Pandey', '+92-304-5432109', 'jaya.pandey@example.com', 18],
    [15, 'Rahul', 'Shah', '+92-324-4321098', 'rahul.shah@example.com', 16],
    [16, 'Anjali', 'Verma', '+92-336-3210987', 'anjali.verma@example.com', 20],
    [17, 'Aryan', 'Naidu', '+92-314-2109876', 'aryan.naidu@example.com', 9],
    [18, 'Neha', 'Raj', '+92-305-1098765', 'neha.raj@example.com', 17],
    [19, 'Rohan', 'Goyal', '+92-346-0987654', 'rohan.goyal@example.com', 13],
    [20, 'Isha', 'Chopra', '+92-306-9876543', 'isha.chopra@example.com', 14]
  ];

  const insertBuyer = database.prepare(`
    INSERT INTO buyers (buyer_id, fname, lname, phoneno, email, agent_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  buyersData.forEach(b => insertBuyer.run(...b));

  // Sellers
  const sellersData = [
    [1, 'Vikram', 'Sinha', '+92-300-1122334', 'vikram.sinha@example.com', 7, 'vikram.sinha@raast'],
    [2, 'Priya', 'Gupta', '+92-321-2233445', 'priya.gupta@example.com', 19, 'priya.gupta@nayapay'],
    [3, 'Aman', 'Chopra', '+92-333-3344556', 'aman.chopra@example.com', 4, 'aman.chopra@sadapay'],
    [4, 'Sneha', 'Sharma', '+92-312-4455667', 'sneha.sharma@example.com', 12, 'sneha.sharma@jazzcash'],
    [5, 'Rohan', 'Verma', '+92-301-5566778', 'rohan.verma@example.com', 9, 'rohan.verma@easypaisa'],
    [6, 'Nisha', 'Reddy', '+92-345-6677889', 'nisha.reddy@example.com', 1, 'nisha.reddy@raast'],
    [7, 'Varun', 'Mehra', '+92-302-7788990', 'varun.mehra@example.com', 15, 'varun.mehra@nayapay'],
    [8, 'Amit', 'Saxena', '+92-322-8899001', 'amit.saxena@example.com', 5, 'amit.saxena@sadapay'],
    [9, 'Ayesha', 'Singh', '+92-334-9900112', 'ayesha.singh@example.com', 20, 'ayesha.singh@jazzcash'],
    [10, 'Ankit', 'Patel', '+92-313-0011223', 'ankit.patel@example.com', 14, 'ankit.patel@easypaisa'],
    [11, 'Divya', 'Kumar', '+92-303-1234567', 'divya.kumar@example.com', 17, 'divya.kumar@raast'],
    [12, 'Rajesh', 'Yadav', '+92-323-2345678', 'rajesh.yadav@example.com', 11, 'rajesh.yadav@nayapay'],
    [13, 'Rhea', 'Shah', '+92-335-3456789', 'rhea.shah@example.com', 8, 'rhea.shah@sadapay'],
    [14, 'Karan', 'Malhotra', '+92-304-4567890', 'karan.malhotra@example.com', 6, 'karan.malhotra@jazzcash'],
    [15, 'Sarika', 'Nair', '+92-324-5678901', 'sarika.nair@example.com', 18, 'sarika.nair@easypaisa'],
    [16, 'Gaurav', 'Jain', '+92-336-6789012', 'gaurav.jain@example.com', 16, 'gaurav.jain@raast'],
    [17, 'Mehak', 'Garg', '+92-314-7890123', 'mehak.garg@example.com', 3, 'mehak.garg@nayapay'],
    [18, 'Aryan', 'Singhal', '+92-305-8901234', 'aryan.singhal@example.com', 10, 'aryan.singhal@sadapay'],
    [19, 'Ishika', 'Mishra', '+92-346-9012345', 'ishika.mishra@example.com', 2, 'ishika.mishra@jazzcash'],
    [20, 'Sujata', 'Das', '+92-306-0123456', 'sujata.das@example.com', 13, 'sujata.das@easypaisa']
  ];

  const insertSeller = database.prepare(`
    INSERT INTO sellers (seller_id, fname, lname, phoneno, email, agent_id, UPI_ID)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  sellersData.forEach(s => insertSeller.run(...s));

  // Properties 1 to 58 from my_dream_home.sql
  const propertiesData = [
    [1, 5000000.00, 'sell', 2, 4, 2010, 'Karachi', 'Clifton Block 2', '75600', 1],
    [2, 20000.00, 'rent', 1, 6, 2021, 'Lahore', 'Gulberg III', '54660', 3],
    [3, 7500000.00, 'sell', 3, 5, 2005, 'Islamabad', 'Sector F-7/2', '44000', 2],
    [4, 30000.00, 'rent', 2, 7, 2015, 'Rawalpindi', 'Bahria Town Phase 4', '46000', 4],
    [5, 4500000.00, 'sell', 1, 10, 2022, 'Faisalabad', 'Kohinoor City', '38000', 6],
    [6, 18000.00, 'rent', 1, 8, 2016, 'Karachi', 'DHA Phase 5', '75500', 15],
    [7, 9000000.00, 'sell', 3, 3, 2008, 'Lahore', 'DHA Phase 6', '54792', 17],
    [8, 35000.00, 'rent', 2, 15, 2014, 'Islamabad', 'Sector F-10/3', '44000', 9],
    [9, 65000.00, 'rent', 3, 9, 2023, 'Rawalpindi', 'Chaklala Scheme 3', '46000', 2],
    [10, 13000.00, 'rent', 1, 1, 2020, 'Karachi', 'PECHS Block 6', '75400', 19],
    [11, 4200000.00, 'sell', 2, 18, 2013, 'Lahore', 'Model Town', '54700', 17],
    [12, 28000.00, 'rent', 2, 13, 2019, 'Peshawar', 'Hayatabad Phase 3', '25000', 5],
    [13, 8500000.00, 'sell', 3, 20, 2011, 'Islamabad', 'Sector E-7', '44000', 6],
    [14, 32000.00, 'rent', 2, 19, 2017, 'Multan', 'Gulgasht Colony', '60000', 16],
    [15, 5500000.00, 'sell', 2, 11, 2009, 'Lahore', 'Johar Town Phase 2', '54782', 14],
    [16, 20000.00, 'rent', 1, 2, 2021, 'Karachi', 'Gulshan-e-Iqbal Block 5', '75300', 19],
    [17, 7000000.00, 'sell', 3, 12, 2007, 'Islamabad', 'Sector F-11/1', '44000', 17],
    [18, 1250000.00, 'sell', 2, 13, 2018, 'Karachi', 'Shahrah-e-Faisal', '75350', 15],
    [19, 7000.00, 'rent', 1, 7, 2015, 'Rawalpindi', 'Saddar Cantt', '46000', 14],
    [20, 11000.00, 'rent', 3, 20, 2020, 'Lahore', 'Mall Road Cantt', '54000', 9],
    [21, 950000.00, 'sell', 2, 2, 2005, 'Karachi', 'DHA Phase 8 Seafront', '75500', 1],
    [22, 15000.00, 'rent', 1, 5, 2010, 'Islamabad', 'Sector G-11', '44000', 2],
    [23, 1000000.00, 'sell', 3, 3, 2009, 'Faisalabad', 'Peoples Colony No 1', '38000', 6],
    [24, 25000.00, 'rent', 2, 2, 2018, 'Peshawar', 'University Town', '25000', 4],
    [25, 750000.00, 'sell', 3, 1, 2003, 'Lahore', 'Cantt Officers Colony', '54810', 9],
    [26, 20000.00, 'rent', 1, 4, 2015, 'Karachi', 'Bahria Town Precinct 1', '75340', 15],
    [27, 600000.00, 'sell', 2, 6, 2010, 'Islamabad', 'Sector I-8/2', '44000', 14],
    [28, 30000.00, 'rent', 3, 3, 2016, 'Multan', 'Bosan Road', '60000', 6],
    [29, 500000.00, 'sell', 1, 5, 2005, 'Rawalpindi', 'Peshawar Road', '46000', 16],
    [30, 18000.00, 'rent', 2, 1, 2012, 'Lahore', 'Wapda Town', '54770', 17],
    [31, 800000.00, 'sell', 3, 4, 2008, 'Karachi', 'Clifton Block 4', '75600', 19],
    [32, 35000.00, 'rent', 1, 6, 2019, 'Islamabad', 'Sector F-8/3', '44000', 14],
    [33, 1200000.00, 'sell', 4, 2, 2010, 'Faisalabad', 'Madina Town', '38000', 6],
    [34, 40000.00, 'rent', 3, 3, 2014, 'Peshawar', 'Warsak Road', '25000', 4],
    [35, 650000.00, 'sell', 2, 1, 2004, 'Lahore', 'DHA Phase 4', '54792', 17],
    [36, 22000.00, 'rent', 1, 5, 2017, 'Karachi', 'North Nazimabad Block B', '74700', 1],
    [37, 900000.00, 'sell', 3, 6, 2011, 'Islamabad', 'Blue Area', '44000', 14],
    [38, 40000.00, 'rent', 2, 4, 2015, 'Quetta', 'Jinnah Town', '87300', 6],
    [39, 550000.00, 'sell', 2, 2, 2007, 'Rawalpindi', 'Satellite Town', '46300', 16],
    [40, 20000.00, 'rent', 1, 1, 2013, 'Lahore', 'Bahria Town Sector C', '53720', 3],
    [41, 235000.00, 'sell', 2, 6, 2015, 'Islamabad', 'Sector D-12', '44000', 14],
    [42, 12500.00, 'rent', 1, 3, 2019, 'Karachi', 'DHA Phase 2', '75500', 19],
    [43, 510000.00, 'sell', 4, 8, 2010, 'Faisalabad', 'Canal Road', '38000', 6],
    [44, 15000.00, 'rent', 2, 5, 2018, 'Multan', 'DHA Multan Sector A', '60000', 16],
    [45, 180000.00, 'sell', 3, 10, 2017, 'Lahore', 'Gulberg II', '54660', 9],
    [46, 17000.00, 'rent', 1, 1, 2019, 'Karachi', 'KDA Scheme 1', '75350', 1],
    [47, 300000.00, 'sell', 5, 9, 2016, 'Islamabad', 'Sector F-6/4', '44000', 2],
    [48, 12000.00, 'rent', 2, 4, 2020, 'Peshawar', 'Hayatabad Phase 5', '25000', 6],
    [49, 250000.00, 'sell', 3, 7, 2013, 'Rawalpindi', 'Bahria Town Safari Valley', '46000', 4],
    [50, 19000.00, 'rent', 1, 2, 2021, 'Lahore', 'DHA Phase 3', '54792', 3],
    [51, 410000.00, 'sell', 4, 5, 2015, 'Islamabad', 'Sector E-11', '44000', 14],
    [52, 13000.00, 'rent', 1, 1, 2022, 'Karachi', 'Bath Island, Clifton', '75530', 19],
    [53, 550000.00, 'sell', 5, 10, 2012, 'Gujranwala', 'DC Colony', '52250', 6],
    [54, 16000.00, 'rent', 2, 6, 2017, 'Quetta', 'Cantt Road', '87300', 16],
    [55, 270000.00, 'sell', 3, 8, 2014, 'Lahore', 'Garden Town', '54600', 17],
    [56, 20000.00, 'rent', 1, 3, 2020, 'Karachi', 'DHA Phase 7', '75500', 1],
    [57, 350000.00, 'sell', 4, 9, 2011, 'Islamabad', 'Sector B-17', '44000', 2],
    [58, 11000.00, 'rent', 2, 4, 2021, 'Sialkot', 'Cantt Area', '51310', 6]
  ];

  const propertyTypes = ['Apartment', 'Penthouse', 'Luxury Villa', 'Modern Studio', 'Duplex', 'Townhouse'];

  const insertProp = database.prepare(`
    INSERT INTO properties (pid, price, status, number_of_bedroom, seller_id, yoc, city, street, postalcode, agent_id, title, image_url, property_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  propertiesData.forEach((p, idx) => {
    const pType = propertyTypes[idx % propertyTypes.length];
    const image = PROPERTY_IMAGES[idx % PROPERTY_IMAGES.length];
    const title = `${p[3]} BHK ${pType} in ${p[7]}, ${p[6]}`;
    insertProp.run(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9], title, image, pType);
  });

  // Seed realistic initial transactions
  const insertTran = database.prepare(`
    INSERT INTO transaction_records (pid, seller_id, buyer_id, transaction_date, transaction_amount, commission, agent_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertTran.run(1, 4, 12, '2024-03-15', 5000000.00, 250000.00, 1);
  insertTran.run(21, 2, 1, '2024-04-20', 950000.00, 47500.00, 1);
  insertTran.run(3, 5, 4, '2024-05-10', 7500000.00, 375000.00, 2);

  console.log('Database initialized and seeded successfully with 58 properties, 20 agents, 20 buyers, 20 sellers, offices and transactions!');
}

module.exports = {
  getDb,
  initDatabase
};
