const express = require('express');
const routers = require('./routes');
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded

const app = express();
const port = 3000;
app.use('/', express.static('public'));
app.set('view engine', 'ejs');

app
    .get('/', function(req, res) {
        res.render('index')
    })
    .get('/categories', function(req, res) {
        res.render('categories')
    })
    .get('/train/:genre', function(req, res) {
        let agentName = req.params.genre
        res.render('train', {
            questions: questions
        })
    })

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// app.use(routers);
app.listen((process.env.PORT || port), () => console.log(`Example app listening on port ${port}!`));
