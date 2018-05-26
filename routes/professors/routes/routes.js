const app = require('../../../bin/www');
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bodyParser = require('body-parser');

const connection = require('../../connection');

router.get('/students/get-full-subjects/:studyYearId/:subjectId', function(req, res) {
    let query = `SELECT S.ID AS studentId, S.STUDENT_NUMBER AS studentNumber, CONCAT(S.FIRST_NAME + ' ' + S.LAST_NAME) AS name,
	MT.NAME AS markTypeName, SG.GRADE AS grade
	FROM STUDENT S INNER JOIN STUDENT_GRADES SG ON S.ID = SG.STUDENT_ID
	INNER JOIN SUBJECT SJ ON SJ.ID = SG.SUBJECT_ID INNER JOIN MARK_TYPE MT ON MT.ID = SG.GRADE_TYPE WHERE SG.STUDY_YEAR_ID = ? AND SG.SUBJECT_ID = ?`;

    console.log(req.params.studyYearId);
    console.log(req.params.subjectId);
    connection.query(query, [req.params.studyYearId, req.params.subjectId], function(err, result) {
        if (err) throw err;

        res.send(result);
    })
})

router.get('/get-mark-types', function(req, res) {
    let query = 'SELECT * FROM MARK_TYPE';

    connection.query(query, function(err, result) {
        if (err) throw err;

        res.send(result);
    })
})

router.post('/add-grade', function(req, res) {
    let query = 'INSERT INTO STUDENT_GRADES SET ?';

    connection.query(query, [req.body], function(err, result) {
        if (err) throw err;

        let temp = {
            errorCode: 0,
            message: 'Grade was successfuly added'
        }
        res.send(temp);
    })
})

router.get('/get-professor-info/:professorId', function(req, res) {
    let query = "SELECT CONCAT(FIRST_NAME, ' ', LAST_NAME) AS professorName FROM PROFESSOR WHERE ID = ?";

    connection.query(query, [req.params.professorId], function(err, result) {
        if (err) throw err;

        res.send(result);
    })
})
module.exports = router;