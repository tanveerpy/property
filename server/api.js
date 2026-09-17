const express = require('express');
const router = express.Router();
const { getDb } = require('./database');

// Helper to format currency
const formatPKR = (val) => {
  if (!val) return 'PKR 0';
  if (val >= 10000000) return `PKR ${(val / 10000000).toFixed(2)} Crore`;
  if (val >= 100000) return `PKR ${(val / 100000).toFixed(2)} Lakh`;
  return `PKR ${Number(val).toLocaleString('en-PK')}`;
};

// -------------------------------------------------------------
// PROPERTIES ENDPOINTS
// -------------------------------------------------------------

router.get('/properties', (req, res) => {
  try {
    const db = getDb();
    const { city, status, minPrice, maxPrice, bedrooms, search } = req.query;

    let query = `
      SELECT 
        p.*,
        a.fname || ' ' || COALESCE(a.lname, '') as agent_name,
        a.email as agent_email,
        a.phoneno as agent_phone,
        s.fname || ' ' || COALESCE(s.lname, '') as seller_name,
        s.email as seller_email,
        s.phoneno as seller_phone,
        s.UPI_ID as seller_upi
      FROM properties p
      LEFT JOIN agent a ON p.agent_id = a.agent_id
      LEFT JOIN sellers s ON p.seller_id = s.seller_id
      WHERE 1=1
    `;
    const params = [];

    if (city && city !== 'All') {
      query += ' AND LOWER(p.city) = LOWER(?)';
      params.push(city);
    }
    if (status && status !== 'all') {
      query += ' AND p.status = ?';
      params.push(status);
    }
    if (bedrooms && bedrooms !== 'all') {
      query += ' AND p.number_of_bedroom = ?';
      params.push(parseInt(bedrooms, 10));
    }
    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(parseFloat(maxPrice));
    }
    if (search) {
      query += ' AND (LOWER(p.title) LIKE ? OR LOWER(p.street) LIKE ? OR LOWER(p.city) LIKE ?)';
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY p.pid DESC';

    const stmt = db.prepare(query);
    const properties = stmt.all(...params);
    res.json({ success: true, count: properties.length, data: properties });
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/properties/:id', (req, res) => {
  try {
    const db = getDb();
    const prop = db.prepare(`
      SELECT 
        p.*,
        a.fname || ' ' || COALESCE(a.lname, '') as agent_name,
        a.email as agent_email,
        a.phoneno as agent_phone,
        s.fname || ' ' || COALESCE(s.lname, '') as seller_name,
        s.email as seller_email,
        s.phoneno as seller_phone,
        s.UPI_ID as seller_upi,
        o.city as office_city,
        o.phone as office_phone
      FROM properties p
      LEFT JOIN agent a ON p.agent_id = a.agent_id
      LEFT JOIN office o ON a.office_id = o.office_id
      LEFT JOIN sellers s ON p.seller_id = s.seller_id
      WHERE p.pid = ?
    `).get(req.params.id);

    if (!prop) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    res.json({ success: true, data: prop });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/properties', (req, res) => {
  try {
    const db = getDb();
    const {
      price,
      status = 'sell',
      number_of_bedroom,
      seller_id,
      yoc = new Date().getFullYear(),
      city,
      street,
      postalcode,
      agent_id,
      title,
      image_url,
      property_type = 'Apartment'
    } = req.body;

    if (!price || !number_of_bedroom || !city || !street) {
      return res.status(400).json({ success: false, error: 'Price, bedrooms, city, and street are required.' });
    }

    const defaultImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
    const computedTitle = title || `${number_of_bedroom} BHK ${property_type} in ${street}, ${city}`;

    const stmt = db.prepare(`
      INSERT INTO properties (
        price, status, number_of_bedroom, seller_id, yoc, city, street, postalcode, agent_id, title, image_url, property_type, year_of_listing
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      parseFloat(price),
      status,
      parseInt(number_of_bedroom, 10),
      seller_id ? parseInt(seller_id, 10) : null,
      yoc ? parseInt(yoc, 10) : new Date().getFullYear(),
      city,
      street,
      postalcode || '',
      agent_id ? parseInt(agent_id, 10) : null,
      computedTitle,
      image_url || defaultImage,
      property_type,
      new Date().getFullYear()
    );

    res.json({
      success: true,
      message: 'Property created successfully',
      data: { pid: Number(result.lastInsertRowid) }
    });
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/properties/:id', (req, res) => {
  try {
    const db = getDb();
    const { price, status, number_of_bedroom, city, street, postalcode, agent_id, seller_id, title } = req.body;
    
    const stmt = db.prepare(`
      UPDATE properties
      SET price = COALESCE(?, price),
          status = COALESCE(?, status),
          number_of_bedroom = COALESCE(?, number_of_bedroom),
          city = COALESCE(?, city),
          street = COALESCE(?, street),
          postalcode = COALESCE(?, postalcode),
          agent_id = COALESCE(?, agent_id),
          seller_id = COALESCE(?, seller_id),
          title = COALESCE(?, title)
      WHERE pid = ?
    `);

    stmt.run(
      price ? parseFloat(price) : null,
      status || null,
      number_of_bedroom ? parseInt(number_of_bedroom, 10) : null,
      city || null,
      street || null,
      postalcode || null,
      agent_id ? parseInt(agent_id, 10) : null,
      seller_id ? parseInt(seller_id, 10) : null,
      title || null,
      req.params.id
    );

    res.json({ success: true, message: 'Property updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/properties/:id', (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM properties WHERE pid = ?').run(req.params.id);
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// AGENTS ENDPOINTS
// -------------------------------------------------------------

router.get('/agents', (req, res) => {
  try {
    const db = getDb();
    const agents = db.prepare(`
      SELECT 
        a.*,
        o.city as office_city,
        o.phone as office_phone,
        o.website as office_website,
        (SELECT COUNT(*) FROM properties p WHERE p.agent_id = a.agent_id AND p.status != 'sold') as active_listings,
        (SELECT COUNT(*) FROM transaction_records t WHERE t.agent_id = a.agent_id) as total_deals
      FROM agent a
      LEFT JOIN office o ON a.office_id = o.office_id
      ORDER BY a.total_saleAmount DESC, a.NOP_sale DESC
    `).all();

    res.json({ success: true, count: agents.length, data: agents });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/agents', (req, res) => {
  try {
    const db = getDb();
    const { fname, lname, email, phoneno, city, street, postalcode, commision = 0.50, office_id = 125 } = req.body;

    if (!fname || !phoneno) {
      return res.status(400).json({ success: false, error: 'First name and phone are required.' });
    }

    // Determine next agent_id
    const maxRow = db.prepare('SELECT MAX(agent_id) as maxId FROM agent').get();
    const nextId = (maxRow.maxId || 0) + 1;

    db.prepare(`
      INSERT INTO agent (agent_id, fname, lname, email, phoneno, city, street, postalcode, commision, NOP_sale, total_saleAmount, office_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0.0, ?)
    `).run(nextId, fname, lname || '', email || '', phoneno, city || '', street || '', postalcode || '', parseFloat(commision), parseInt(office_id, 10));

    // Also create login for agent
    const uname = `@${fname}`;
    const pword = `${fname}123`;
    db.prepare('INSERT OR IGNORE INTO agent_login (username, password) VALUES (?, ?)').run(uname, pword);

    res.json({ success: true, message: 'Agent added successfully', data: { agent_id: nextId, username: uname, defaultPassword: pword } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// OFFICES ENDPOINTS
// -------------------------------------------------------------

router.get('/offices', (req, res) => {
  try {
    const db = getDb();
    const offices = db.prepare(`
      SELECT 
        o.*,
        (SELECT COUNT(*) FROM agent a WHERE a.office_id = o.office_id) as total_agents
      FROM office o
      ORDER BY o.office_id ASC
    `).all();
    res.json({ success: true, count: offices.length, data: offices });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// BUYERS & SELLERS ENDPOINTS
// -------------------------------------------------------------

router.get('/buyers', (req, res) => {
  try {
    const db = getDb();
    const buyers = db.prepare(`
      SELECT 
        b.*,
        a.fname || ' ' || COALESCE(a.lname, '') as agent_name,
        a.email as agent_email
      FROM buyers b
      LEFT JOIN agent a ON b.agent_id = a.agent_id
      ORDER BY b.buyer_id DESC
    `).all();
    res.json({ success: true, count: buyers.length, data: buyers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/buyers', (req, res) => {
  try {
    const db = getDb();
    const { fname, lname, phoneno, email, agent_id } = req.body;
    if (!fname || !phoneno) {
      return res.status(400).json({ success: false, error: 'Name and phone are required.' });
    }

    const maxRow = db.prepare('SELECT MAX(buyer_id) as maxId FROM buyers').get();
    const nextId = (maxRow.maxId || 0) + 1;

    db.prepare(`
      INSERT INTO buyers (buyer_id, fname, lname, phoneno, email, agent_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(nextId, fname, lname || '', phoneno, email || '', agent_id ? parseInt(agent_id, 10) : null);

    res.json({ success: true, message: 'Buyer registered successfully', data: { buyer_id: nextId } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/buyers/:id', (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM buyers WHERE buyer_id = ?').run(req.params.id);
    res.json({ success: true, message: 'Buyer deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/sellers', (req, res) => {
  try {
    const db = getDb();
    const sellers = db.prepare(`
      SELECT 
        s.*,
        a.fname || ' ' || COALESCE(a.lname, '') as agent_name,
        (SELECT COUNT(*) FROM properties p WHERE p.seller_id = s.seller_id) as total_properties
      FROM sellers s
      LEFT JOIN agent a ON s.agent_id = a.agent_id
      ORDER BY s.seller_id DESC
    `).all();
    res.json({ success: true, count: sellers.length, data: sellers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/sellers', (req, res) => {
  try {
    const db = getDb();
    const { fname, lname, phoneno, email, agent_id, UPI_ID } = req.body;
    if (!fname || !phoneno) {
      return res.status(400).json({ success: false, error: 'Name and phone are required.' });
    }

    const maxRow = db.prepare('SELECT MAX(seller_id) as maxId FROM sellers').get();
    const nextId = (maxRow.maxId || 0) + 1;

    db.prepare(`
      INSERT INTO sellers (seller_id, fname, lname, phoneno, email, agent_id, UPI_ID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(nextId, fname, lname || '', phoneno, email || '', agent_id ? parseInt(agent_id, 10) : null, UPI_ID || '');

    res.json({ success: true, message: 'Seller registered successfully', data: { seller_id: nextId } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/sellers/:id', (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM sellers WHERE seller_id = ?').run(req.params.id);
    res.json({ success: true, message: 'Seller deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// TRANSACTIONS & DEAL CLOSURE
// -------------------------------------------------------------

router.get('/transactions', (req, res) => {
  try {
    const db = getDb();
    const transactions = db.prepare(`
      SELECT 
        t.*,
        p.title as property_title,
        p.city as property_city,
        p.street as property_street,
        b.fname || ' ' || COALESCE(b.lname, '') as buyer_name,
        b.phoneno as buyer_phone,
        b.email as buyer_email,
        s.fname || ' ' || COALESCE(s.lname, '') as seller_name,
        s.UPI_ID as seller_upi,
        a.fname || ' ' || COALESCE(a.lname, '') as agent_name,
        a.email as agent_email
      FROM transaction_records t
      LEFT JOIN properties p ON t.pid = p.pid
      LEFT JOIN buyers b ON t.buyer_id = b.buyer_id
      LEFT JOIN sellers s ON t.seller_id = s.seller_id
      LEFT JOIN agent a ON t.agent_id = a.agent_id
      ORDER BY t.transaction_id DESC
    `).all();

    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/transactions', (req, res) => {
  try {
    const db = getDb();
    const { pid, buyer_id, seller_id, transaction_date = new Date().toISOString().split('T')[0], transaction_amount, commission, agent_id } = req.body;

    if (!pid || !buyer_id || !transaction_amount || !agent_id) {
      return res.status(400).json({
        success: false,
        error: 'Property ID, Buyer ID, Agent ID, and Transaction Amount are required.'
      });
    }

    const amount = parseFloat(transaction_amount);
    // Default commission calculation: 2% - 5% if not provided
    const calculatedCommission = commission !== undefined ? parseFloat(commission) : (amount * 0.05);

    // Insert transaction record - Trigger will automatically mark property as sold and update agent sales stats
    const stmt = db.prepare(`
      INSERT INTO transaction_records (pid, seller_id, buyer_id, transaction_date, transaction_amount, commission, agent_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      parseInt(pid, 10),
      seller_id ? parseInt(seller_id, 10) : null,
      parseInt(buyer_id, 10),
      transaction_date,
      amount,
      calculatedCommission,
      parseInt(agent_id, 10)
    );

    res.json({
      success: true,
      message: 'Deal closed successfully! Property marked as SOLD and agent performance updated.',
      data: {
        transaction_id: Number(result.lastInsertRowid),
        pid,
        status: 'sold',
        transaction_amount: amount,
        commission: calculatedCommission
      }
    });
  } catch (err) {
    console.error('Error closing deal:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// ANALYTICS & DASHBOARD METRICS
// -------------------------------------------------------------

router.get('/analytics/stats', (req, res) => {
  try {
    const db = getDb();

    // Summary counts
    const totalProps = db.prepare('SELECT COUNT(*) as count FROM properties').get().count;
    const forSaleCount = db.prepare("SELECT COUNT(*) as count FROM properties WHERE status = 'sell'").get().count;
    const forRentCount = db.prepare("SELECT COUNT(*) as count FROM properties WHERE status = 'rent'").get().count;
    const soldCount = db.prepare("SELECT COUNT(*) as count FROM properties WHERE status = 'sold'").get().count;

    const totalDeals = db.prepare('SELECT COUNT(*) as count, COALESCE(SUM(transaction_amount), 0) as volume, COALESCE(SUM(commission), 0) as commission FROM transaction_records').get();

    const totalAgents = db.prepare('SELECT COUNT(*) as count FROM agent').get().count;
    const totalBuyers = db.prepare('SELECT COUNT(*) as count FROM buyers').get().count;
    const totalSellers = db.prepare('SELECT COUNT(*) as count FROM sellers').get().count;

    // City distribution
    const cityBreakdown = db.prepare(`
      SELECT 
        city,
        COUNT(*) as total_properties,
        SUM(CASE WHEN status = 'sell' THEN 1 ELSE 0 END) as for_sale,
        SUM(CASE WHEN status = 'rent' THEN 1 ELSE 0 END) as for_rent,
        SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold,
        AVG(price) as avg_price
      FROM properties
      GROUP BY city
      ORDER BY total_properties DESC
    `).all();

    // Top Agents by Sales
    const topAgents = db.prepare(`
      SELECT 
        agent_id,
        fname || ' ' || COALESCE(lname, '') as name,
        city,
        NOP_sale,
        total_saleAmount,
        email,
        phoneno
      FROM agent
      ORDER BY total_saleAmount DESC, NOP_sale DESC
      LIMIT 5
    `).all();

    // Recent activity
    const recentTransactions = db.prepare(`
      SELECT 
        t.transaction_id,
        t.transaction_date,
        t.transaction_amount,
        t.commission,
        p.title as property_title,
        p.city,
        b.fname || ' ' || COALESCE(b.lname, '') as buyer_name,
        a.fname || ' ' || COALESCE(a.lname, '') as agent_name
      FROM transaction_records t
      JOIN properties p ON t.pid = p.pid
      JOIN buyers b ON t.buyer_id = b.buyer_id
      JOIN agent a ON t.agent_id = a.agent_id
      ORDER BY t.transaction_id DESC
      LIMIT 5
    `).all();

    res.json({
      success: true,
      data: {
        totalProperties: totalProps,
        forSaleCount,
        forRentCount,
        soldCount,
        totalDealsCount: totalDeals.count,
        totalVolume: totalDeals.volume,
        totalCommission: totalDeals.commission,
        totalAgents,
        totalBuyers,
        totalSellers,
        cityBreakdown,
        topAgents,
        recentTransactions
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// PREDEFINED / CUSTOM QUERY STUDIO
// -------------------------------------------------------------

router.get('/queries', (req, res) => {
  try {
    const db = getDb();
    const { type } = req.query;

    let results = [];
    let title = '';
    let description = '';

    switch (type) {
      case 'top_earners':
        title = 'Top Performing Agents by Sales Volume';
        description = 'Agents sorted by total closed sales amount and deal count';
        results = db.prepare(`
          SELECT 
            a.agent_id,
            a.fname || ' ' || COALESCE(a.lname, '') as agent_name,
            a.city,
            a.phoneno,
            a.NOP_sale as deals_closed,
            a.total_saleAmount as total_revenue,
            a.commision as commission_rate,
            o.city as office_location
          FROM agent a
          JOIN office o ON a.office_id = o.office_id
          ORDER BY a.total_saleAmount DESC, a.NOP_sale DESC
        `).all();
        break;

      case 'recently_built':
        title = 'Modern Properties (Built 2018 or Later)';
        description = 'Properties with Year of Construction 2018 onwards';
        results = db.prepare(`
          SELECT 
            p.pid,
            p.title,
            p.city,
            p.price,
            p.status,
            p.yoc as year_built,
            p.number_of_bedroom as bedrooms,
            a.fname || ' ' || COALESCE(a.lname, '') as agent_name
          FROM properties p
          LEFT JOIN agent a ON p.agent_id = a.agent_id
          WHERE p.yoc >= 2018
          ORDER BY p.yoc DESC, p.price DESC
        `).all();
        break;

      case 'city_pricing':
        title = 'City-Level Pricing & Inventory Analysis';
        description = 'Average prices, price spans, and available stock per metropolitan city';
        results = db.prepare(`
          SELECT 
            city,
            COUNT(*) as total_units,
            ROUND(AVG(price), 2) as average_price,
            MIN(price) as min_price,
            MAX(price) as max_price
          FROM properties
          GROUP BY city
          ORDER BY total_units DESC
        `).all();
        break;

      case 'high_value_listings':
        title = 'Prime Luxury Estates (Price >= PKR 5,000,000)';
        description = 'High-end investment properties currently listed';
        results = db.prepare(`
          SELECT 
            p.pid,
            p.title,
            p.city,
            p.street,
            p.price,
            p.number_of_bedroom as bedrooms,
            p.status,
            a.fname || ' ' || COALESCE(a.lname, '') as agent_name,
            s.fname || ' ' || COALESCE(s.lname, '') as seller_name
          FROM properties p
          LEFT JOIN agent a ON p.agent_id = a.agent_id
          LEFT JOIN sellers s ON p.seller_id = s.seller_id
          WHERE p.price >= 5000000
          ORDER BY p.price DESC
        `).all();
        break;

      case 'rental_deals':
        title = 'Available Rental Properties';
        description = 'Verified residential rentals categorized by bedrooms';
        results = db.prepare(`
          SELECT 
            p.pid,
            p.title,
            p.city,
            p.street,
            p.price as monthly_rent,
            p.number_of_bedroom as bedrooms,
            a.fname || ' ' || COALESCE(a.lname, '') as agent_name,
            a.phoneno as contact
          FROM properties p
          LEFT JOIN agent a ON p.agent_id = a.agent_id
          WHERE p.status = 'rent'
          ORDER BY p.price ASC
        `).all();
        break;

      default:
        return res.status(400).json({ success: false, error: 'Invalid query type' });
    }

    res.json({ success: true, title, description, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// AUTHENTICATION
// -------------------------------------------------------------

router.post('/auth/login', (req, res) => {
  try {
    const db = getDb();
    const { username, password, role = 'admin' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required.' });
    }

    let found = null;
    if (role === 'admin') {
      found = db.prepare('SELECT username FROM admin_login WHERE username = ? AND password = ?').get(username, password);
    } else if (role === 'agent') {
      found = db.prepare('SELECT username FROM agent_login WHERE username = ? AND password = ?').get(username, password);
    } else if (role === 'office') {
      found = db.prepare('SELECT username FROM office_login WHERE username = ? AND password = ?').get(username, password);
    }

    if (found) {
      return res.json({
        success: true,
        user: {
          username: found.username,
          role
        }
      });
    }

    // Default fallback: allow demo login
    if (password === 'admin123' || password === 'agent123' || password === 'office123') {
      return res.json({
        success: true,
        user: {
          username: username || 'demo_user',
          role
        }
      });
    }

    res.status(401).json({ success: false, error: 'Invalid credentials. Try username: admin, password: admin123' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// -------------------------------------------------------------
// AUTH - SIGNUP
// -------------------------------------------------------------
router.post('/auth/signup', (req, res) => {
  try {
    const db = getDb();
    const { username, password, role, email, fullName } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ success: false, error: 'Username, password and role are required.' });
    }
    if (role === 'guest') {
      return res.status(400).json({ success: false, error: 'Cannot create a guest account.' });
    }

    const table = role === 'admin' ? 'admin_login' : role === 'agent' ? 'agent_login' : 'office_login';

    // Check duplicate
    const existing = db.prepare(`SELECT username FROM ${table} WHERE username = ?`).get(username);
    if (existing) {
      return res.status(409).json({ success: false, error: 'Username already exists. Choose a different one.' });
    }

    db.prepare(`INSERT INTO ${table} (username, password) VALUES (?, ?)`).run(username, password);

    res.json({ success: true, user: { username, role } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

