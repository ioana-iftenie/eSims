const app = require('../../../bin/www');
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bodyParser = require('body-parser');

const connection = require('../../connection');

router.get('/get-student-info/:studentId', function(req, res) {
    let query = `SELECT CONCAT(FIRST_NAME, ' ', LAST_NAME) AS studentName, STUDENT_NUMBER AS studentNumber FROM STUDENT WHERE ID = ?`;

    connection.query(query, req.params.studentId, function(err, result) {
        if (err) throw err;

        res.send(result);
    })
})

router.get('/get-current-stusy-years/:studentId', function(req, res) {
    let query = `SELECT SI.STUDY_YEAR_ID, SY.SEMESTER, S.NAME, S.RANK, S.STUDY_YEAR, SY.UNIVERSITY_YEAR FROM STUDENT_INFO SI 
    INNER JOIN STUDY_YEAR SY ON SI.STUDY_YEAR_ID = SY.ID 
    INNER JOIN SPECIALIZE S ON S.ID = SY.SPECIALIZE_ID WHERE SI.STUDENT_ID = ? ORDER BY SY.SEMESTER ASC`;

    connection.query(query, [req.params.studentId], function(err, result) {
        if (err) throw err;
        
        res.send(result);
    })
})

router.get('/get-optional-subjects/:studyYearS1/:studyYearS2/:studyYear/:rank/:specialize', function(req, res) {
    let queryVerify = `SELECT * FROM STUDENT_OPTIONAL_SUBJECT WHERE STUDY_YEAR_ID IN (?)`;
    let queryGetSubjects = `SELECT * FROM SUBJECT WHERE STUDY_YEAR = ? AND RANK = ? AND SPECIALIZE = ? 
                            AND OPTIONAL_GROUP IS NOT NULL AND STATUS_IND = 1 ORDER BY SEMESTER`;

    connection.query(queryVerify, [req.params.studyYearS1, req.params.studyYearS2], function(err, result) {
        if (err) throw err;

        if (result.length > 0) {
            let toSend = {
                errorCode: 1,
                message: 'You have already picked your optionals for the next year!'
            }
            res.send(toSend)
        } else {
            connection.query(queryGetSubjects, [req.params.studyYear, req.params.rank, req.params.specialize], function(err, result) {
                if (err) throw err;

                res.send(result);
            })
        }
    })
})

router.post('/add-optional-subjects', function(req, res) {
    let query = `INSERT INTO STUDENT_OPTIONAL_SUBJECT (STUDENT_ID, SUBJECT_ID, STUDY_YEAR_ID) VALUES ?`;

    connection.query(query, [req.body.subjects], function(err, result) {
        if (err) throw err;

        let toSend = {
            errorCode: 0,
            message: "The selected optionals were saved."
        };

        res.send(toSend);
    })
})
module.exports = router;