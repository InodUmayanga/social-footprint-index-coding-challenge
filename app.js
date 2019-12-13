const express = require('express');
const https = require('https');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const userData = require('./models/userData');
const options = {
    hostname: 'dodat-programming-test.s3-ap-southeast-2.amazonaws.com',
    port: 443,
    path: '/dodatrhys_events.json',
    method: 'GET'
}


//connect to the mongo DB to store and read the data file
mongoose.connect(
    'mongodb+srv://inod:'
    + process.env.MONGO_ATLAS_PW
    + '@cluster0-oeodj.mongodb.net/mean-app?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => {
        console.log('successfully connected to DB!');
    })
    .catch(() => {
        console.log('Connection faliure');
    });

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

//read the data file content from given url and store it in the mongoDB
function storeDatafileToDB() {
    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {

            const data = new userData({
                content: JSON.parse(d)
            });
            console.log(JSON.parse(d));
            data.save();

        })
    })
    req.on('error', error => {
        console.error(error)
    })
    req.end()
}

storeDatafileToDB();

// and sending the
app.get('/api/getevents', (req, res, next) => {
    //retrieve the data file from the DB
    userData.find().limit(1)
        .then(documents => {
            // reduce content as desired output json
            let reducedEventsArray = documents[0].content.items.map(singleEvent => {
                return {
                    id: singleEvent.id,
                    start: singleEvent.start.dateTime,
                    end: singleEvent.end.dateTime
                }
            });
            res.status(200).json(
                {
                    events: reducedEventsArray
                }
            );
        });
});

module.exports = app;


