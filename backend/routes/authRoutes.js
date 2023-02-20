const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CONNECTION_CONFIG, JWT_SECRET } = require('../configs');

// LOGIN
router.post('/:table/login', async (req, res) => {
  const table = req.params.table;
  const { email, password } = req.body;
  try {
    const connection = await mysql.createConnection(CONNECTION_CONFIG);
    const [user] = await connection.execute(`SELECT * FROM ${table} WHERE email = ?`, [email]);

    if (!user) {
      return res.status(401).send('Invalid credentials');
    }
    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      return res.status(401).send('Invalid credentials');
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user[0].id }, JWT_SECRET, { expiresIn: '1h' });

    // Return the JWT token
    res.json({ token, ...user[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
