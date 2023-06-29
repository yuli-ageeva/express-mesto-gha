const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const InternalServerError = require('./errors/InternalServerError');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '649d75d38b25b169d720a41b',
  };
  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  next(new InternalServerError('На сервере произошла ошибка'));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
