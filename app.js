const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');

const app = express();
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

const authHelper = function (req, res, next) {
  req.user = {
    _id: '649d75d38b25b169d720a41b',
  };
  next();
};

app.use(express.json());
app.use(authHelper);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use((_req, _res) => {
  throw new NotFoundError('Неизвестный путь');
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
