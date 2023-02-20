const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');

const { CONNECTION_CONFIG, JWT_SECRET, MAILTRAP_CONFIG, MAIL_OPTIONS } = require('../configs');

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


function sendEmail(student) {
  const transporter = nodemailer.createTransport(MAILTRAP_CONFIG);
  const emailTemplate = fs.readFileSync('./scoreEmail.html', 'utf-8');
  const { firstName, email, mark1, mark2, mark3 } = student
  const emailBody = emailTemplate.replace('{{ name }}', firstName).replace('{{ mark1 }}', mark1).replace('{{ mark2 }}', mark2).replace('{{ mark3 }}', mark3);
  const mailOptions = {
    ...MAIL_OPTIONS,
    to: email,
    html: emailBody
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
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

    if (req.body.mark3) {
      const selectQuery = `SELECT * FROM ${table} WHERE id = ?`;
      const [selectResult] = await connection.execute(selectQuery, [id]);
      sendEmail(selectResult[0]);
    }

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
