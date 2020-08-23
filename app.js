let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let Promise = require('bluebird');

mongoose.Promise = Promise;

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

const dbConfig = require('./config/db.config.js');

mongoose.connect(dbConfig.url, {
	useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

let port = process.env.PORT || 8011;

require('./routes.js')(app);
app.listen(port);  

console.log('Prepaid card Management running on port ' + port);