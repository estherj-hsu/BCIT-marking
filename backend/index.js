const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const CONFIGS = {
  host: process.env.MYSQL_HOST_IP,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

app.use(cors());
app.use(bodyParser.json());

// GET TABLE
app.get('/api/:table', async (req, res) => {
  try {
    // Get the table name from the URL parameter
    const table = req.params.table;

    // Create a connection to the database
    const connection = await mysql.createConnection(CONFIGS);

    // Execute a SELECT query to get all records from the specified table
    const [rows] = await connection.execute(`SELECT * FROM ${table}`);

    // Return the results as JSON
    res.json(rows);
  } catch (error) {
    // Return an error response if there was a problem with the query
    console.error(error);
    res.status(500).json({ error: 'Unable to get records' });
  }
});

// GET ROW BY ID
app.get('/api/:table/:id', async (req, res) => {
  try {
    // Get the table name from the URL parameter
    const table = req.params.table;
    const id = req.params.id;

    // Create a connection to the database
    const connection = await mysql.createConnection(CONFIGS);

    // Execute a SELECT query to get all records from the specified table
    const [row] = await connection.execute(`SELECT * FROM ${table} WHERE id = ${id}`);

    // Return the results as JSON
    res.json(row[0]);
  } catch (error) {
    // Return an error response if there was a problem with the query
    console.error(error);
    res.status(500).json({ error: 'Unable to get records' });
  }
});

// UPDATE ROW BY ID
app.put('/api/:table/:id', async (req, res) => {
  try {
    // Get the table name and record ID from the URL parameters
    const table = req.params.table;
    const id = req.params.id;

    // Create a connection to the database
    const connection = await mysql.createConnection(CONFIGS);

    // Execute an UPDATE query to update the specified record in the specified table
    const columns = Object.keys(req.body);
    // const columns = Object.keys(tempData);
    const placeholders = columns.map((column) => `${column} = ?`).join(', ');
    const query = `UPDATE ${table} SET ${placeholders} WHERE id = ?`;
    const params = [...Object.values(req.body), id];

    // Execute the update query
    const [result] = await connection.execute(query, params);

    // Return a success response with the number of rows that were affected by the update
    res.json({ affectedRows: result.affectedRows });
  } catch (error) {
    // Return an error response if there was a problem with the query
    console.error(error);
    res.status(500).json({ error: 'Unable to update record' });
  }
});


app.listen(process.env.REACT_APP_SERVER_PORT, () => {
  console.log(`App server now listening on port ${process.env.REACT_APP_SERVER_PORT}`);
});
