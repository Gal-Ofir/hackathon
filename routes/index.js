const router = require('express').Router();
const handlers = require('./handlers');

router.get('/intents', handlers.getAllIntents);
router.put('/intents/', handlers.updateIntentByName);
router.post('/webhook', handlers.handleIntents);
module.exports = router;
