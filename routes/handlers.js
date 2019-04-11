const {getAllIntentNamesAndCurrentAnswers, changeIntentAnswerByName} = require('../utils');

const getAllIntents = (req, res) => {
    getAllIntentNamesAndCurrentAnswers()
        .then(response => {
            console.log(JSON.stringify(response));
            res.json(response)
        });
};

const updateIntentByName = (req, res) => {
    const {name, newMessage} = req.body;
    changeIntentAnswerByName(name, newMessage)
        .then(response => {
            res.json(response)
        })
        .catch(err => res.json(err));
};

const handleIntents = (req, res) => {
    console.log(req.body);
    const intentName = req.body.result.metadata.intentName;
    if (intentName === 'Make appointment' && !req.body.result.actionIncomplete) {
        const {date, time, number} = req.body.result.parameters;
        res.json({
            speech: `Sure, I booked your reservation for ${date}, at ${time}. I will send an SMS to confirm your reservation`
        });
    }
    else {
        res.json({
            speech: `Your question was ${req.body.result.resolvedQuery}`
        });
    }
};

const bulkUpdateIntentByName = (req, res) => {
    const {data} = req.body;
    const promises = [];
    data.forEach(intent => {
        promises.push(changeIntentAnswerByName(intent.name, intent.newMessage));
    });
    Promise.all(promises)
        .then(responses => {
            res.json({status: 'success'});
        })
};

module.exports = {getAllIntents, updateIntentByName, handleIntents, bulkUpdateIntentByName};