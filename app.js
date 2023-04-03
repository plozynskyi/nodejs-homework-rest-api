const express = require('express');

const logger = require('morgan');
const cors = require('cors');

const { contactsRouter } = require('./routes/api/contactsRoutes');
const { authRouter } = require('./routes/api/authRouter');

const { errorHandler } = require('./middleware/middleware');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/users', authRouter);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

module.exports = app;
