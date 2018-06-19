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
    // let queryGetSubjects = `SELECT * FROM SUBJECT WHERE STUDY_YEAR = ? AND RANK = ? AND SPECIALIZE = ? 
    //                         AND OPTIONAL_GROUP IS NOT NULL AND STATUS_IND = 1 ORDER BY SEMESTER`;

    let queryGetSubjects = `SELECT * FROM SUBJECT S INNER JOIN STUDY_PLAN SP ON S.ID = SP.SUBJECT_ID 
                            WHERE (SP.STUDY_YEAR_ID = ? OR SP.STUDY_YEAR_ID = ?) AND S.OPTIONAL_GROUP IS NOT NULL AND 
                            S.IS_MANDATORY = 1 AND S.STATUS_IND = 1 ORDER BY S.SEMESTER`;
                            

    connection.query(queryVerify, [req.params.studyYearS1, req.params.studyYearS2], function(err, result) {
        if (err) throw err;

        if (result.length > 0) {
            let toSend = {
                errorCode: 1,
                message: 'You have already picked your optionals for the next year!'
            }
            res.send(toSend)
        } else {
            connection.query(queryGetSubjects, [req.params.studyYearS1, req.params.studyYearS2 ], function(err, result) {
                if (err) throw err;

                res.send(result);
            })
        }
    })
})

router.post('/add-optional-subjects', function(req, res) {
    console.log(req.body)
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

router.get('/get-selected-optional-subjects/:studyYearIdS1/:studyYearIdS2/:studentId', function(req, res) {
    let query = 'SELECT * FROM SUBJECT S INNER JOIN STUDENT_OPTIONAL_SUBJECT SOS ON S.ID = SOS.SUBJECT_ID WHERE SOS.STUDENT_ID = ? AND (SOS.STUDY_YEAR_ID = ? OR SOS.STUDY_YEAR_ID = ?) ORDER BY S.SEMESTER, S.OPTIONAL_GROUP';

    connection.query(query, [req.params.studentId, req.params.studyYearIdS1, req.params.studyYearIdS2], function(err, result) {
        if (err) throw err;
        res.send(result)
    })
})
module.exports = router;