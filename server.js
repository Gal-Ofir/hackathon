const express = require('express');
const routers = require('./routes');
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded

const app = express();
const port = 3000;
app.use('/', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(routers);
app.listen((process.env.PORT || port), () => console.log(`Example app listening on port ${port}!`));