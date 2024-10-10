const express = require('express');
const  {  getMessages, sendMessage } = require ('../controllers/MessageController.js');

const router = express.Router();

router.post('/', sendMessage);

router.get('/:chatId', getMessages);

module.exports = router;