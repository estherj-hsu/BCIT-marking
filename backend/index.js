const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const tableRoutes = require('./routes/tableRoutes');

app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api', tableRoutes);

app.listen(process.env.REACT_APP_SERVER_PORT, () => {
  console.log(`App server now listening on port ${process.env.REACT_APP_SERVER_PORT}`);
});
