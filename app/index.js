var express = require('express');
var session = require('express-session');
var extend = require('extend');
var bodyParser = require('body-parser');
var qdb = require('./questions.json');
var app = express();
var qlength = 3; // TODO change to 10

// Choose random quiz questions; returns array [ {id: 5}, {id: 14}, {id: 1} ... to num ]
function getQuizSet(jsonobj, num) {  // TODO by Parth
    return [ {"id": 5}, {"id": 2}, {"id": 8}];
}

// Initialize state object
function newStateObject() {
    return {
        "phase": 0, // 0 - initial phase; 1 - name set, questions; 2 - finished
        "name": "",
        "q": 1,
        "qset": [],
        "score": 0
    };
};

// Get state object
function getStateObject(obj) {
    return {
        "phase": obj.phase,
        "name": obj.name,
        "q": obj.q
    };
};

// Return current question // TODO fill
function getQuestion(jsonobj, num) {
    return {
        "q": num,
        "max": qlength,
        "qt": "Why do people organize hackathons?",
        "arr": [
            {"c": 1, "t": "Because they like fun.", "s": 5},
            {"c": 2, "t": "Because they're bored."},
            {"c": 3, "t": "Because they're forced to by aliens."},
            {"c": 4, "t": "No idea!"} ]
    };
};

app.use(session({
    secret: 'somesecret',
    resave: true,
    saveUninitialized: true
}));
app.use("/", express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var sess;

// API GET - getting current state for session user
app.get('/api', function (req, res) {
    sess = req.session;

    // API returns JSON resposne
    res.setHeader('Content-Type', 'application/json');

    // Initialize state object if it's not yet defined
    if (typeof sess.state === 'undefined' || sess.state === 'null') {
        sess.state = newStateObject();
    }

    // Return current state based on phase
    switch(sess.state.phase) {
        case 0:
            res.json(getStateObject(sess.state));
            break;
        case 1:
            res.json(extend(getStateObject(sess.state), getQuestion(qdb, sess.state.q)));
            break;
        case 2:
            res.json(extend(getStateObject(sess.state), {score: sess.state.score}));
            break;
        default:
            res.json(getStateObject(sess.state));
    }
    res.end();
});

// API POST - interacting with quiz state object
app.post('/api', function(req, res) {
    sess=req.session;

    // Check if state is already defined
    if (typeof sess.state === 'undefined' || sess.state === 'null') {
        sess.state = newStateObject();
    }

    // Do actions
    switch(sess.state.phase) {
        case 0:
            if (typeof req.body.username !== 'undefined'
                    && req.body.username !== null
                    && req.body.username.length > 0
                    && req.body.username.length < 25) {

                sess.state.name = req.body.username;
                sess.state.phase = 1;
                sess.state.qset = getQuizSet(qdb, qlength);
            }
            break;
        case 1:
            if (typeof req.body.choice !== 'undefined'
                    && req.body.choice !== null
                    && !isNaN(parseInt(req.body.choice))
                    && parseInt(req.body.choice) >= 0
                    && parseInt(req.body.choice) <= 5) {

                sess.state.score = sess.state.score + parseInt(req.body.choice); //TODO
                sess.state.q++;

                if (sess.state.q > qlength) {
                    sess.state.phase = 2;
                }
            }
            break;
        case 2:

            break;
    }

    res.end('done');

});

 // Temp reset service
 app.post('/reset', function(req, res) {
    sess=req.session;

    // API returns JSON resposne
    res.setHeader('Content-Type', 'application/json');

    // Reset state object to phase 0
    sess.state = newStateObject();

    // Respond
    res.send(JSON.stringify(getStateObject(sess.state)));
 });

var server = app.listen(3000, function () {

});

// var express = require('express');
// var session = require('express-session');
// var bodyParser = require('body-parser');
// var app = express();
//
// app.use(session({
//     secret: 'somesecret',
//     resave: true,
//     saveUninitialized: true
// }));
// app.use("/", express.static("public"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
//
// var sess;
//
// app.get('/api', function (req, res) {
//     sess=req.session;
//     console.log(sess);
//     res.setHeader('Content-Type', 'application/json');
//     res.send(JSON.stringify({ a: sess.logged }));
// });
//
// app.get('/hello', function (req, res) {
//     sess=req.session;
//     //res.setHeader('Content-Type', 'application/json');
//     console.log('Request URL:', req.query.test);
//     res.send("Hello World!!!");
// });
//
// app.post('/login', function(req, res) {
//   sess=req.session;
//   sess.logged = req.body.username;
//   //console.log('You sent the: "' + JSON.stringify(req));
//   res.end('done');
// });
//
// var server = app.listen(3000, function () {
//
//
//
// });
