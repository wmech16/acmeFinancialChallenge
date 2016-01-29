var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var low = require('lowdb');
var _ = require('lodash');
var storage = require('lowdb/file-async');
var db = low('../data/users.json', { storage: storage });

var jwt = require('jsonwebtoken');

var secret = "hire me";
var router = express.Router();


low.path='../data/users.json';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static((path.resolve('../client'))));
app.use(express.static((path.resolve('../client/bower_components'))));



router.use(function(req, res, next) {
    var bearerToken = req.headers.authorization;
    var userToken = bearerToken.split(' ')[1];

    if (userToken) {
        jwt.verify(userToken, secret , function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Auth failed.' });
            } else {

                req.decoded = decoded;
                next();
            }
        });

    } else {


        return res.status(403).send({
            success: false,
            message: 'no token.'
        });

    }

});
router.get('/verify', function(req, res) {

    res.send({redirect: 'profile'});
});

app.get('/',function(req,res){

    res.sendFile(path.resolve('../client/views/login.html'));
});

app.get('/data',function(req,res){
  //var user = db('users').find({email: 'henderson.briggs@geeknet.net'});
   //console.log(user);




});

app.post('/login',function(req, res) {
   var email = req.body.email;

    var user = db('users').find({email: email});
        if (!user) {
            res.send({errorMessage:"Wrong email", errorCode: 400})
        }

        else if(user.password === req.body.password){
           var person = user;

           var token = jwt.sign(person,secret,{expiresIn: 10000});
            res.json({token:token});
        }
        else{
            res.send({errorMessage:"Wrong password", errorCode:401})
        }


});

router.post('/edit', function(req,res){

    var editUser = req.body;

    _.assign( db('users').find({guid: editUser.guid }), {
        address : editUser.address,
        company : editUser.company,
        age: editUser.age,
        phone : editUser.phone,
        eyeColor: editUser.eyeColor,
        email: editUser.email
        });
    _.assign( db('users').find({guid: editUser.guid }), {
        address : editUser.address,
        company : editUser.company,
        age: editUser.age,
        phone : editUser.phone,
        eyeColor: editUser.eyeColor,
        email: editUser.email
    });
    res.send({redirect:'profile'});

});
app.use('/api',router);
app.listen(3000);
console.log("Listening on 3000!");