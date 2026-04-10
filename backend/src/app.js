require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connect } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/projects', require('./routes/projects'));
app.use('/tasks', require('./routes/tasks'));

app.get('/health', (_, res) => res.json({ ok: true }));

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connect()
  .then(() => app.listen(PORT, () => console.log(`Server running on :${PORT}`)))
  .catch((err) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });
