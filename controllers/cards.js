const { Card } = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const RequestError = require('../errors/RequestError');
const InternalServerError = require('../errors/InternalServerError');

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      next(new InternalServerError('На сервере произошла ошибка'));
    });
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(new InternalServerError('На сервере произошла ошибка'));
      }
    });
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(card);
    })
    .catch(() => {
      next(new InternalServerError('На сервере произошла ошибка'));
    });
}

function likeCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(card);
    })
    .catch(() => {
      next(new InternalServerError('На сервере произошла ошибка'));
    });
}

function dislikeCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(card);
    })
    .catch(() => {
      next(new InternalServerError('На сервере произошла ошибка'));
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
