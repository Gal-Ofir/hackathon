const CLIENT_ID = 'b82225a97aa64833942d6f5aef224c40  ';
const DEVELOPER_TOKEN = '3993aa2ae0e9413ba4d09b4b30cc7cb8';
const PROJECT_ID = 'hackathon-2a8da';
const INTENTS_URL = 'https://api.dialogflow.com/v1/intents?v=20150910';
const GOOGLE_CALENDER_CLIENT_ID = '469053331980-tu836344jpsojncnpqorsmf8a8579ok9.apps.googleusercontent.com\n';
const GOOGLE_CALENDER_SECRET = '6w0xePfBQgk_YF53UiiX5VX3';
const CALENDER_ID = 'galx56@gmail.com';
const GOOGLE_CALENDER_API_KEY = 'AIzaSyCOxYLQtqF8KX3dzkN39q58eMWe6WhmMd4';
const {google} = require('googleapis');
const SMS_KEY = 'jcGEN/jn80Y-Y2R4VyS65SRjwR1NqaFJCUzOtXntys';
const SMS_SEND_URL = 'https://api.txtlocal.com/send/';
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
            }
        })
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


// Set beginning of query to 3 pm tomorrow
const tomorrow3pm = new Date();
tomorrow3pm.setDate(tomorrow3pm.getDate() + 1);
tomorrow3pm.setHours(15, 0, 0);

// Set end of query to 4 pm tomorrow
const tomorrow4pm = new Date();
tomorrow4pm.setDate(tomorrow3pm.getDate() + 1);
tomorrow4pm.setHours(16, 0, 0);

const fs = require('fs');
const readline = require('readline');
const insertEvent = (data) => {
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Calendar API.
        authorize(JSON.parse(content), insertEvents, data);
    });
};


const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

function authorize(credentials, callback, callbackData) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback, callbackData);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client, callbackData);
    });
}


function getAccessToken(oAuth2Client, callback, callbackData) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client, callbackData);
        });
    });
}
function insertEvents(auth, data) {
    console.log(data);
    const {startTime, endTime, description, calenderId} = data;
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.insert({
        calendarId: calenderId,
        resource: {
            start: {dateTime: startTime},
            end: {dateTime: endTime},
            description: description,
            summary: calenderId,
            sendUpdates: 'all',
            attendees: [{email: calenderId}]
        }
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        console.log(res);
    });
}


const sendSms = (message, number) => {
    return rp.post({
        uri: SMS_SEND_URL,
        form: {
            apikey: SMS_KEY, numbers: number,
            message: message, sender: 'Moti'
        }});
};



module.exports = {changeIntentAnswerByName, changeIntentById, getAllIntentNamesAndCurrentAnswers, insertEvent, sendSms};