const app = require('../../bin/www');
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const session = require('express-session')

const connection = require('../connection');

router.use(session({ resave: true, secret: '123456', saveUninitialized: true}));

router.post('/login', function(req, res, next) {
    let queryLogin = 'SELECT OUTER_ID, PASSWORD, IS_ADMIN, IS_STUDENT, IS_PROFESSOR FROM USER WHERE USERNAME = ?';
   
    if (!req.body.username || !req.body.password) {
        res.status(400).send("Invalid request parameters.");

        return;
    }

    connection.query(queryLogin, req.body.username, function(err, result) {
        if (err) 
            console.log("[mysql error]",err);
        
        if (result.length == 0) {
            res.status(401).send("Invalid username or password");

            return;
        }

        if (result.length == 0 || req.body.password != result[0].PASSWORD) {
            res.status(401).send("Invalid username or password");

            return;
        }

        let expiresDate = new Date();
        expiresDate.setTime(expiresDate.getTime() + 60 * 60 * 24 * 1000);

        let token = jwt.sign({id: result[0].OUTER_ID, expiresIn: 60 * 60 * 24}, req.app.get('superSecret'), {
            expiresIn: '1d'
        });

        req.session.user = {
            outerId: result[0].OUTER_ID,
            isAdmin: result[0].IS_ADMIN,
            isStudent: result[0].IS_STUDENT,
            isProfessor: result[0].IS_PROFESSOR
        }

        res.send(response = {
            access_token: token,
            user_id: result[0].OUTER_ID,
            is_admin: result[0].IS_ADMIN ? '1' : '0',
            is_student: result[0].IS_STUDENT ? '1' : '0',
            is_professor: result[0].IS_PROFESSOR ? '1' : '0'
        });
        
    })
})

router.get('/get-user-info/:outerId/:isAdmin/:isStudent/:isProfessor', function(req, res, next) {
    let userQuery = 'SELECT * FROM ADMIN WHERE ID = ?';

    if (req.params.outerId != req.session.user.outerId || 
        req.params.isAdmin != req.session.user.isAdmin ||
        req.params.isStudent != req.session.user.isStudent ||
        req.params.isProfessor != req.session.user.isProfessor ) {
            res.redirect('/login')
        
    } else {
        if (req.session.user.isProfessor == 1) {
            userQuery = 'SELECT * FROM PROFESSOR WHERE ID = ?';
        }
        
        if (req.session.user.isStudent == 1) {
            userQuery = 'SELECT * FROM STUDENT WHERE ID = ?';
        }
        
        if (req.session.user.isAdmin == 1) {
            userQuery = 'SELECT * FROM ADMIN WHERE ID = ?';
        }

        connection.query(userQuery, [req.session.user.outerId], function(error, response) {
            if (error) throw error;
            res.send(response[0]);
        })
    }
})

module.exports = router;