const { Card } = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const RequestError = require('../errors/RequestError');
const InternalServerError = require('../errors/InternalServerError');

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => {
      res.status(200).json(cards);
    })
    .catch(() => {
      next(new InternalServerError('На сервере произошла ошибка'));
    });
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  if (!name || !link) {
    return next(new RequestError('Не указаны обязательные поля name и link'));
  }

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).json(card);
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
      res.status(200).json(card);
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
      res.status(200).json(card);
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
      res.status(200).json(card);
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
