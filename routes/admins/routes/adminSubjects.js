const app = require('../../../bin/www');
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bodyParser = require('body-parser');

const connection = require('../../connection');

router.post('/create', function(req, res, next) {
    // let insertQuery = 'INSERT INTO SUBJECT (NAME, POINTS, SEMESTER, STUDY_YEAR, RANK, DATE_EXAM, IS_MANDATORY, STATUS_IND, OPTIONAL_GROUP) VALUES (?)';
    let insertQuery = 'INSERT INTO subject SET ?';
    
    var examDate = 'Every year, month ' + req.body.examDate.date.month;

    let temp = {
        name: req.body.name,
        is_mandatory: req.body.isMandatory,
        study_year: req.body.studyYear,
        rank: req.body.rank,
        specialize: req.body.specialize,
        semester: req.body.semester,
        points: req.body.points,        
        date_exam: examDate.toString(),
        optional_group: req.body.isMandatory == 1 ? null : req.body.subjectCategory,
        status_ind: true
    }

    var query = connection.query(insertQuery, temp, function(err, result) {
        let response;

        if (err)  {
            response = {
                errorCode: 1,
                message: 'Something went wrong'
            }

            throw err;
            res.send(response)
        } else {
            response = {
                errorCode: 0,
                message: 'Subject ' + req.body.name + ' was added successfuly'
            }

            res.send(response)
        }
    })

    console.log(query.sql)
});

router.get('/search/:searchString/:allActive', function(req, res) {

    if (req.params.allActive == true) {
        let query = 'SELECT * FROM SUBJECT WHERE NAME LIKE ? WHERE STATUS_IND = 1'
    } else {
        let query = 'SELECT * FROM SUBJECT WHERE NAME LIKE ?';
    }
    connection.query(query, '%' + req.params.searchString + '%', function(err, response) {
        if (err) throw err;

        promiseWrongRows = new Promise(function(resolve, reject) {
            let toSend = [];

            response.forEach(subject => {
                if (req.params.allActive == false) {
                    let active = subject.status_ind == 1 ? 'Active' : 'Inactive';
                    let temp = {
                        name: subject.name + ' (' + active + ') ',
                        value: subject.id
                    };
                } else {
                    let temp = {
                        name: subject.name,
                        value: subject.id
                    };
                }
                toSend.push(temp);
            });

            resolve(toSend);
            reject("Something went wrong.");
        })

        promiseWrongRows.then(function(response) {
            res.send(response);
        })
    })
})

router.get('/serchSubjectByStudyPlan/:searchString/:semester/:rank/:studyYear/:specialize', function(req, res) {
    let query = 'SELECT ID AS id, NAME AS name FROM SUBJECT WHERE NAME LIKE ? AND STATUS_IND = 1 AND SEMESTER = ? AND RANK = ? AND STUDY_YEAR = ? AND SPECIALIZE = ?';

    connection.query(query, ['%' + req.params.searchString + '%', req.params.semester.toString(), req.params.rank.toString(), req.params.studyYear, req.params.specialize.toString()], function(err, response) {
        if (err) throw err;

        res.send(response);
    })
})

router.get('/get-subject-info/:subjectId', function(req, res) {
    let query = 'SELECT * FROM SUBJECT WHERE ID = ?';

    connection.query(query, req.params.subjectId, function(err, response) {
        if (err) throw err;

        res.send(response);
    })
})

router.post('/update', function(req, res) {

    let query = 'UPDATE SUBJECT SET STATUS_IND = ? WHERE ID = ?';

    connection.query(query, [req.body.statusInd, req.body.id], function(err, response) {
        if (err) throw err;

        res.send({errorCode: 0, message: "Subject was updated successfully"})
    })
})

router.get('/view-all-subjects', function(req, res) {
    let query = 'SELECT * FROM SUBJECT ORDER BY RANK, STUDY_YEAR, SEMESTER, SPECIALIZE ASC, OPTIONAL_GROUP IS NULL, IS_MANDATORY DESC;'

    connection.query(query, function(err, response) {
        if (err) throw err;

        res.send(response); 
    })
})

router.get('/get-study-plan', function(req, res) {
    let query = 'SELECT * FROM STUDY_YEAR SY INNER JOIN SPECIALIZE S ON SY.SPECIALIZE_ID = S.ID WHERE STATUS_IND = 1 ORDER BY SY.UNIVERSITY_YEAR DESC, SY.SEMESTER, S.STUDY_YEAR, S.RANK ASC';

    connection.query(query, function(err, response) {
        if (err) throw err;
        res.send(response);
    })
})

router.post('/get-study-year', function(req, res) {
    let query = 'SELECT SY.ID FROM STUDY_YEAR SY INNER JOIN (SELECT ID FROM SPECIALIZE S WHERE S.NAME = ? AND STUDY_YEAR = ? AND RANK = ?) S ON SY.SPECIALIZE_ID = S.ID WHERE SY.UNIVERSITY_YEAR = ? AND SY.SEMESTER = ?';

    connection.query(query, [req.body.name, req.body.studyYear, req.body.rank, req.body.universityYear, req.body.semester], function(err, result) {
        if (err) throw err;
        
        res.send(result);
    })
})

router.post('/create-study-plan', function(req, res) {
    let query = 'INSERT INTO STUDY_PLAN (STUDY_YEAR_ID, SUBJECT_ID) VALUES ?';

    connection.query(query, [req.body.data], function(err, result) {
        if (err) throw err;

        let done = {
            errorCode: 0,
            message: 'Study plan successfuly created'
        }
        res.send(done);
    })
})

router.get('/get-subjects-from-study-plan/:studyPlanId', function(req, res) {
    let query = 'SELECT S.NAME AS name, S.OPTIONAL_GROUP AS optionalGroup FROM STUDY_PLAN SP INNER JOIN SUBJECT S ON SP.SUBJECT_ID = S.ID WHERE SP.STUDY_YEAR_ID = ? ORDER BY S.IS_MANDATORY DESC';

    connection.query(query, [req.params.studyPlanId], function(err, result) {
        if (err) throw err;

        res.send(result);
    })
})

module.exports = router;