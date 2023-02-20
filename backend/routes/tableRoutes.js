const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CONNECTION_CONFIG, JWT_SECRET } = require('../configs');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decoded;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

// GET TABLE
router.get('/:table', requireAuth, async (req, res) => {
  try {
    const table = req.params.table;
    const connection = await mysql.createConnection(CONNECTION_CONFIG);
    const [rows] = await connection.execute(`SELECT * FROM ${table}`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to get records' });
  }
});

// GET ROW BY ID
router.get('/:table/:id', requireAuth, async (req, res) => {
  try {
    const table = req.params.table;
    const id = req.params.id;
    const connection = await mysql.createConnection(CONNECTION_CONFIG);
    const [row] = await connection.execute(`SELECT * FROM ${table} WHERE id = ?`, [id]);

    res.json(row[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to get records' });
  }
});

// UPDATE ROW BY ID
router.put('/:table/:id', requireAuth, async (req, res) => {
  try {
    const table = req.params.table;
    const id = req.params.id;
    const connection = await mysql.createConnection(CONNECTION_CONFIG);
    const columns = Object.keys(req.body);
    const placeholders = columns.map((column) => `${column} = ?`).join(', ');
    const query = `UPDATE ${table} SET ${placeholders} WHERE id = ?`;
    const params = [...Object.values(req.body), id];
    const [result] = await connection.execute(query, params);

    res.json({ affectedRows: result.affectedRows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update record' });
  }
});

// ADD NEW ROW TO TABLE
router.post('/:table', requireAuth, async (req, res) => {
  try {
    const table = req.params.table;
    const data = req.body;
    console.log('data', data)
    if (data.password) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(data.password, salt);
      console.log('hashedPassword', data.password, hashedPassword)
      data.password = hashedPassword;
    }
    const connection = await mysql.createConnection(CONNECTION_CONFIG);
    const result = await connection.query(`INSERT INTO ${table} SET ?`, data);
    res.json({ success: true, result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update record' });
  }
});

module.exports = router;
