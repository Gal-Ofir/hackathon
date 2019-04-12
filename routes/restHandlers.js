const {getAllIntentNamesAndCurrentAnswers, changeIntentAnswerByName, insertEvent, sendSms} = require('../utils-rest');
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
        const {date, time, number} = req.body.result.parameters;
        const dateMoment = moment(date, "YYYY-MM-DD");
        const [hour, minute, seconds] = time.split(":");
        const startTime = dateMoment.toDate();
        const endTime = dateMoment.toDate();
        res.json({
            speech: `Sure, I booked your reservation for ${date}, at ${hour}:${minute}.`
        });

        startTime.setHours(parseInt(hour)-3, minute, seconds);
        endTime.setHours(parseInt(hour)-2, minute, seconds);

        const description = (number) ? `[MOTI] Reservation for ${number}` : `[MOTI] Appointment Scheduled`;
        const calenderId = 'galx56@gmail.com';
        const data = {startTime, endTime, description, calenderId};
        const smsMessage = `Your reservation is confirmed! On ${date} at ${hour}:${minute}`;
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