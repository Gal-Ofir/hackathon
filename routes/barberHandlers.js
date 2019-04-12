const {getAllIntentNamesAndCurrentAnswers, changeIntentAnswerByName, insertEvent, sendSms} = require('../utils-barb');
const moment = require('moment');

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
        const {date, time, treatment} = req.body.result.parameters;
        const dateMoment = moment(date, "YYYY-MM-DD");
        const [hour, minute, seconds] = time.split(":");
        const startTime = dateMoment.toDate();
        const endTime = dateMoment.toDate();
        res.json({
            speech: `Sure, I booked your ${treatment} appointment for ${date}, at ${hour}:${minute}. I will send an SMS to confirm your reservation`
        });

        startTime.setHours(parseInt(hour)-3, minute, seconds);
        endTime.setHours(parseInt(hour)-2, minute, seconds);

        const description = `[MOTI] Appointment Scheduled - ${treatment}`;
        const calenderId = 'galx56@gmail.com';
        const data = {startTime, endTime, description, calenderId};
        const smsMessage = `Your your ${treatment} appointment is confirmed! On ${date} at ${hour}:${minute}`;
        insertEvent(data);
        sendSms(smsMessage, '+972545222886');
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