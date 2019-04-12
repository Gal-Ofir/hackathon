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
    .get('/train', function(req, res) {
        let agent = req.query.agent
        console.log("agent: ", agent);
        res.render(agent)
    })
    .get('/dashboard', function(req, res) {
        res.send('dashboard');
    })

// app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser());
app.use(routers);
app.listen((process.env.PORT || port), () => console.log(`Example app listening on port ${port}!`));
