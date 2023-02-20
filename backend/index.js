const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const CONFIGS = {
  host: process.env.MYSQL_HOST_IP,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};
const JWT_SECRET = '1r5eITvCUmlTlsJEbV?hBLxWryP83FqOSxP-nMcaGeIH=hIXgkrN0vEvp/vORKweMmTJPp/r0/U/yFJcw6CMH5lFPe2k3qb/xgU';

app.use(cors());
app.use(bodyParser.json());

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

// LOGIN
app.post('/api/:table/login', async (req, res) => {
  const table = req.params.table;
  const { email, password } = req.body;
  try {
    const connection = await mysql.createConnection(CONFIGS);
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


// GET TABLE
app.get('/api/:table', requireAuth, async (req, res) => {
  try {
    const table = req.params.table;
    const connection = await mysql.createConnection(CONFIGS);
    const [rows] = await connection.execute(`SELECT * FROM ${table}`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to get records' });
  }
});

// GET ROW BY ID
app.get('/api/:table/:id', requireAuth, async (req, res) => {
  try {
    const table = req.params.table;
    const id = req.params.id;
    const connection = await mysql.createConnection(CONFIGS);
    const [row] = await connection.execute(`SELECT * FROM ${table} WHERE id = ${id}`);

    res.json(row[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to get records' });
  }
});

// UPDATE ROW BY ID
app.put('/api/:table/:id', requireAuth, async (req, res) => {
  try {
    const table = req.params.table;
    const id = req.params.id;
    const connection = await mysql.createConnection(CONFIGS);
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
app.post('/api/:table', requireAuth, async (req, res) => {
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
    const connection = await mysql.createConnection(CONFIGS);
    const result = await connection.query(`INSERT INTO ${table} SET ?`, data);
    res.json({ success: true, result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update record' });
  }
});


app.listen(process.env.REACT_APP_SERVER_PORT, () => {
  console.log(`App server now listening on port ${process.env.REACT_APP_SERVER_PORT}`);
});
