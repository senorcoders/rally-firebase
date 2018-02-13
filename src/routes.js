const express = require('express');
const router = express.Router();
const admin = require('./firebase-admin');
const firebaseMiddleware = require('express-firebase-middleware');
var db = admin.database();
var ref = db.ref("users");
router.use((req, res, next) => {
    next();
});

router.use('/api', firebaseMiddleware.auth);

router.get('/', (req, res) => {
    res.json({
        message: 'Home'
    });
});

router.get('/api/hello', (req, res) => {
    res.json({
        message: `You're logged in as ${res.locals.user.email} with Firebase UID: ${res.locals.user.uid}`
    });
});
router.get('/users', (req, res) => {
       ref.once("value").then(snapshot => {
        res.send(snapshot.val())
       });
});

router.get('/users/:userid', (req, res) => {
    ref.orderByChild('apiRallyID').equalTo(req.params.userid).once("value", function(snapshot){
        res.send(snapshot.val());
        snapshot.forEach(function(data) {
                console.log("Key", data.key);
      });
    });
});

router.delete('/users/:userid', (req, res) => {
    ref.orderByChild('apiRallyID').equalTo(req.params.userid).once("value", function(snapshot){
        snapshot.forEach(function(data) {
                console.log("Key", data.key);
            admin.auth().deleteUser(data.key)
                .then(function(){
                    res.json({
                        message: 'Successfully deleted user'
                    });
                })
                .catch(function(error){
                    res.send(error);
                });
      });
    });
});


module.exports = router;
