
const router = require('express').Router();
const auth   = require('./auth');

router.use('/auth', auth);          // endpoints become /api/auth/register, etc.

module.exports = router;
