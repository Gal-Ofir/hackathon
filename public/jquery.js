$( document ).ready(function() {

    $.ajax({
        method: 'GET',
        url: '/intents',
    })
        .done(function(response) {
            response.forEach(function(intentFromServer) {
                const {name, id, responses, userSays} = intentFromServer;
                let questions = "";
                let answers = "";
                userSays.forEach(function(question, i) {
                    questions += `${i+1}. ${question.text} <br>`;
                });
                responses[0].messages.forEach(function(answerObj) {
                    if (Array.isArray(answerObj.speech) && answerObj.length) {
                        answerObj.speech.forEach(function (answer, i) {
                            answers += `${i + 1}. ${answer} <br>`
                        });
                    }
                    else if (answerObj.speech) {
                        answers += `1. ${answerObj.speech}`;
                    }
                });
                const parameters = responses[0].parameters;
               $('#table').append("<tr><td>" + id + "</td>" +
                                       "<td>" +name  + "</td>" +
                                        "<td>" +questions  + "</td>" +
                                        "<td>" +answers  + "</td>"
                                        +"<td>" +JSON.stringify(parameters) + "</td>"+ "</tr>");
            });
        })


});