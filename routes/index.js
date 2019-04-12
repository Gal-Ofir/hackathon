const router = require('express').Router();
const weddingHandlers = require('./weddingHandlers');
const restHandlers = require('./restHandlers');
const barberHandlers = require('./barberHandlers');

router.get('/wedding/intents', weddingHandlers.getAllIntents);
router.put('/wedding/intents/', weddingHandlers.updateIntentByName);
router.post('/wedding/intents/bulk/', weddingHandlers.bulkUpdateIntentByName);
router.post('/wedding/webhook', weddingHandlers.handleIntents);

router.get('/rest/intents', restHandlers.getAllIntents);
router.put('/rest/intents/', restHandlers.updateIntentByName);
router.post('/rest/intents/bulk/', restHandlers.bulkUpdateIntentByName);
router.post('/rest/webhook', restHandlers.handleIntents);

router.get('/barber/intents', barberHandlers.getAllIntents);
router.put('/barber/intents/', barberHandlers.updateIntentByName);
router.post('/barber/intents/bulk/', barberHandlers.bulkUpdateIntentByName);
router.post('/barber/webhook', barberHandlers.handleIntents);

module.exports = router;
