var express = require('express');
var session = require('express-session');
var extend = require('extend');
var bodyParser = require('body-parser');
var qdb = require('./questions.json');
var sdb = require('./scores.json');
var fs = require('fs');
var app = express();
var qlength = 10; // number of questions 


// Choose random quiz questions; returns array [ {id: 5}, {id: 14}, {id: 1} ... to num ]
function getQuizSet(jsonobj, num, cat) {
    var qall = [];
    for (var i=0; i < jsonobj.length; i++) {
        if (jsonobj[i].category === cat) {
            qall.push({"id": i});
        }
    }
 
    var l = qall.length; // Fisher Yates Shuffle alg
    var j = 0, temp;
    while (l--) {
        j = Math.floor(Math.random() * (l+1));
        temp = qall[l]; //swap
        qall[l] = qall[j];
        qall[j] = temp;
    }
    
    // splice array
    qall.splice(0, qall.length - num);
 
    return qall;
}

// Initialize state object
function newStateObject() {
    return {
        phase: 0, // 0 - initial phase; 1 - name set, questions; 2 - finished
        name: "",
        q: 1,
        qset: [],
        score: 0
    };
};

// Get state object
function getStateObject(obj) {
    return {
        phase: obj.phase,
        name: obj.name,
        q: obj.q
    };
};

// Return current question 
function getQuestion(jsonobj, q, num) {
    return {
        "q": q,
        "max": qlength,
        "qt": jsonobj[num].question, 
        "img": jsonobj[num].img.toString().trim(),
        "arr": [
            {"c": 1, "t": jsonobj[num].choice[0].c},
            {"c": 2, "t": jsonobj[num].choice[1].c},
            {"c": 3, "t": jsonobj[num].choice[2].c},
            {"c": 4, "t": jsonobj[num].choice[3].c}]
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
            res.json(extend(getStateObject(sess.state), getQuestion(qdb, sess.state.q, sess.state.qset[sess.state.q-1].id)));
            break;
        case 2:
            res.json(extend(getStateObject(sess.state), {score: sess.state.score}, {scores: sdb}));
            break;
        default:
            res.json(getStateObject(sess.state));
    }

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
                    && req.body.username.length < 25
                    && typeof req.body.category !== 'undefined'
                    && req.body.category !== null
                    && req.body.category.length > 0
                    && req.body.category.length < 25
                    
                    ) {

                sess.state.name = req.body.username;
                sess.state.phase = 1;
                sess.state.qset = getQuizSet(qdb, qlength, req.body.category); 

            }
            break;
        case 1:
            if (typeof req.body.choice !== 'undefined'
                    && req.body.choice !== null
                    && !isNaN(parseInt(req.body.choice))
                    && parseInt(req.body.choice) > 0
                    && parseInt(req.body.choice) < 5) {
                
                // score
                sess.state.score += qdb[sess.state.qset[sess.state.q-1].id].choice[req.body.choice-1].answ;;
                sess.state.q++;

                // finalize test
                if (sess.state.q > qlength) {
                    sess.state.phase = 2;
                    
                    // normalize score (0-100)
                    var maxs = 0;
                    var mins = 0;
                    var ta = [];
                    for (var i = 0; i < sess.state.qset.length; i++) {
                        ta = [
                            qdb[sess.state.qset[i].id].choice[0].answ,
                            qdb[sess.state.qset[i].id].choice[1].answ,
                            qdb[sess.state.qset[i].id].choice[2].answ,
                            qdb[sess.state.qset[i].id].choice[3].answ
                        ];
                        maxs += Math.max.apply(null, ta);
                        mins += Math.min.apply(null, ta);
                    }
                    
                    sess.state.score = Math.round(100.0*(sess.state.score-mins)/(maxs-mins));

                    // score table
                    for (i = 0; i < sdb.length; i++) {
                        console.log("s: " + sdb[i].score);
                        if (sess.state.score > sdb[i].score) {
                            console.log("inserting before it: " + sess.state.score);
                            sdb.splice(i, 0, {name: sess.state.name, score: sess.state.score});
                            sdb.splice(-1,1);
                            
                            // save scores json file (modified)
                            fs.writeFile("./app/scores.json", JSON.stringify(sdb), function(err) { 
                                if(err) {
                                    return console.log(err);
                                }
                            });
                            
                            break;
                        }
                    }
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

