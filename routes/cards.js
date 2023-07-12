const express = require('express');

const router = express.Router();
const cardController = require('../controllers/cards');
const { validateCreateCard, validateCardId } = require('../utils/cardValidator');

router.get('/', cardController.getCards);
router.post('/', validateCreateCard, cardController.createCard);
router.delete('/:cardId', validateCardId, cardController.deleteCard);
router.put('/:cardId/likes', validateCardId, cardController.likeCard);
router.delete('/:cardId/likes', validateCardId, cardController.dislikeCard);

module.exports = router;
