const {changeIntentAnswerByName, getAllIntentNamesAndCurrentAnswers} = require('./utils');

changeIntentAnswerByName('Address', 'shitty uck')
    .then(response => {console.log(response)});

// getAllIntentNamesAndCurrentAnswers()
// .then(response => {
//     response.forEach(intent => {
//         console.log(JSON.stringify(intent));
//     })
// });