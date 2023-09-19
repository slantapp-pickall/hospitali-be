const express = require('express');
const router = express.Router();

const { index, signle, block } = require('../controllers/users.controller');
const { admin } = require('../middleware/');

router.use(admin);

router.get('/', index);
router.get('/:id', signle);
router.put('/block/:id', block);

module.exports = router;
