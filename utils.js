const CLIENT_ID = 'b82225a97aa64833942d6f5aef224c40  ';
const DEVELOPER_TOKEN = 'abfa428d27da4d5faae7d8ead07321c3';
const PROJECT_ID = 'hackathon-2a8da';
const INTENTS_URL = 'https://api.dialogflow.com/v1/intents?v=20150910';
// const rp = require('request-promise');
const headers = {authorization: `Bearer ${DEVELOPER_TOKEN}`};
const rp = require('request-promise');

const responsesMapper = (responses) => {
    return {
        messages: responses.messages,
        parameters: responses.parameters.map(parameter => {
            return {
                required: parameter.required,
                dataType: parameter.dataType,
                value: parameter.value,
                prompts: parameter.prompts,
                name: parameter.name
            }})
    };
};

const userSaysMapper = (userSays) => {
    return {text: userSays.data.map(data => data.text)};
};

const getAllIntentNamesAndCurrentAnswers = () => {
    return new Promise((resolve, reject) => {
        const result = [];
        const promises = [];
        rp({
            uri: 'https://api.dialogflow.com/v1/intents?v=20150910',
            headers: headers,
            json: true
        })
            .then(response => {
                response.forEach(intent => {
                    promises.push(
                        rp({
                                uri: 'https://api.dialogflow.com/v1/intents/' + intent.id + '?v=20150910',
                                headers: headers,
                                json: true
                            }
                        ));
                });
                return Promise.all(promises);
            })
            .then(response => {
                response.forEach(intent => {
                    result.push({
                        id: intent.id,
                        name: intent.name,
                        responses: intent.responses.map(responsesMapper),
                        userSays: intent.userSays.map(userSaysMapper),
                    });
                });
                resolve(result);
            })
            .catch(err => reject(err));
    });
};

const changeIntentAnswerByName = (name, newMessage) => {
    return new Promise((resolve, reject) => {
        rp({
            uri: INTENTS_URL,
            method: 'GET',
            headers: headers,
            json: true
        })
            .then((response) => {
                return response.filter(intent => intent.name === name)[0];
            })
            .then(intent => {
                return rp({
                    uri: 'https://api.dialogflow.com/v1/intents/' + intent.id + '?v=20150910',
                    headers: headers,
                    json: true
                })
            })
            .then(response => {
                response.responses[0].messages[0].speech = newMessage;
                console.log(response.responses[0].messages[0].speech);
                return response;
            })
            .then(newIntent => {
                return rp({
                    uri: 'https://api.dialogflow.com/v1/intents/' + newIntent.id + '?v=20150910',
                    method: 'PUT',
                    headers: headers,
                    json: true,
                    body: newIntent
                })
            })
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err);
            });
    });
};

const changeIntentById = (id, newMessage) => {
    return new Promise((resolve, reject) => {
            rp({
                uri: 'https://api.dialogflow.com/v1/intents/' + id + '?v=20150910',
                headers: headers,
                json: true
            })
                .then(response => {
                    response.responses[0].messages[0].speech = newMessage;
                    console.log(response.responses[0].messages[0].speech);
                    return response;
                })
                .then(newIntent => {
                    return rp({
                        uri: 'https://api.dialogflow.com/v1/intents/' + newIntent.id + '?v=20150910',
                        method: 'PUT',
                        headers: headers,
                        json: true,
                        body: newIntent
                    })
                })
                .then(response => {
                    resolve(response);
                })
                .catch(err => {
                    reject(err);
                });
        }
    );
};


module.exports = {changeIntentAnswerByName, changeIntentById, getAllIntentNamesAndCurrentAnswers};