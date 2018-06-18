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
});

router.get('/search/:searchString/:allActive', function(req, res) {
    let query = 'SELECT * FROM SUBJECT WHERE NAME LIKE ?';

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

                    toSend.push(temp);
                } else {
                    if (subject.status_ind == 1) {
                        let temp = {
                            name: subject.name,
                            value: subject.id
                        };
                        toSend.push(temp);
                    }
                }
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
    let query = 'SELECT S.NAME AS name, S.OPTIONAL_GROUP AS optionalGroup, S.ID AS subjectId FROM STUDY_PLAN SP INNER JOIN SUBJECT S ON SP.SUBJECT_ID = S.ID WHERE SP.STUDY_YEAR_ID = ? ORDER BY S.IS_MANDATORY DESC';

    connection.query(query, [req.params.studyPlanId], function(err, result) {
        if (err) throw err;

        res.send(result);
    })
})

// -------- Start Routes For Students Subject ------

router.get('/get-students-for-study-year-id/:studyYearId', function(req, res) {
    let query = "SELECT S.ID AS id, S.STUDENT_NUMBER AS studentNumber, CONCAT(S.FIRST_NAME, ' ', S.LAST_NAME) AS name, SI.GROUP_NAME AS groupName FROM STUDENT S INNER JOIN STUDENT_INFO SI ON S.ID = SI.STUDENT_ID WHERE SI.STUDY_YEAR_ID = ?";

    connection.query(query, req.params.studyYearId, function(err, result) {
        if (err) throw err;

        res.send(result);
    })
})

router.get('/get-mandatory-subjects-from-study-plan/:studyYearId', function(req, res) {
    let query = 'SELECT S.ID AS id, S.NAME AS name FROM STUDY_PLAN SP INNER JOIN SUBJECT S ON SP.SUBJECT_ID = S.ID WHERE SP.STUDY_YEAR_ID = ? AND S.IS_MANDATORY = 1 AND S.OPTIONAL_GROUP IS NULL';

    connection.query(query, [req.params.studyYearId], function(err, result) {
        if (err) throw err;

        res.send(result);
    })
})

router.get('/get-optional-subjects/:studyYearId', function(req, res) {
    let queryVerifyOptionals = 'SELECT SJ.ID AS id, SJ.NAME AS name, SJ.OPTIONAL_GROUP AS optional_group FROM STUDY_PLAN SP INNER JOIN SUBJECT SJ ON SP.SUBJECT_ID = SJ.ID WHERE SP.STUDY_YEAR_ID = ? AND SJ.IS_MANDATORY = 1 AND OPTIONAL_GROUP IS NOT NULL ORDER BY OPTIONAL_GROUP';
    let queryGetOptionals = 'SELECT S.ID AS student_id, SJ.ID AS subject_id, SJ.NAME AS subject_name, SJ.OPTIONAL_GROUP AS optional_group FROM STUDENT S INNER JOIN STUDENT_OPTIONAL_SUBJECT SOS ON S.ID = SOS.STUDENT_ID INNER JOIN SUBJECT SJ ON SOS.SUBJECT_ID = SJ.ID WHERE SOS.STUDY_YEAR_ID = ? ORDER BY S.ID';

    connection.query(queryVerifyOptionals, [req.params.studyYearId], function(err, result) {
        if (err) throw err;
        let optionalSubjects = result;

        if (result.length > 0) {
            connection.query(queryGetOptionals, [req.params.studyYearId], function(err, result) {
                if (err) throw err;
                let response = {
                    errorCode: 0,
                    statusCode: 0,
                    optionalSubjects: optionalSubjects,
                    selectedOptionals: result
                }

                res.send(response);

            })

        } else {
            let response = {
                errorCode: 0,
                statusCode: 1,
                message: 'There are no optional subjects for this study plan'
            }

            res.send(response);
        }
    })
})

router.get('/get-unpromoted-subjects/:studyYearIdRenumbered/:studyYearIdLastYear', function(req, res) {
    // let getUnpomoted = `SELECT S.ID AS student_id, ss.subject_id as subject_id, sj.name as name FROM STUDENT S INNER JOIN student_info_audit SIA ON S.ID = SIA.STUDENT_ID 
	// INNER JOIN STUDY_YEAR SY ON SIA.study_year_id = SY.ID inner join student_subject ss on ss.study_year_id = SIA.study_year_id 
    // inner join subject sj on sj.id = ss.subject_id WHERE SIA.is_restant = 1 AND SY.SEMESTER = (SELECT SEMESTER FROM STUDY_YEAR WHERE ID = ?) and ss.final_grade = 4`;

    let getUnpomoted = `SELECT S.ID AS studentId, SS.SUBJECT_ID AS subjectId, SJ.NAME AS subjectName FROM STUDENT S
        INNER JOIN STUDENT_SUBJECT SS ON S.ID = SS.STUDENT_ID 
        INNER JOIN SUBJECT SJ ON SS.SUBJECT_ID = SJ.ID WHERE SS.STUDY_YEAR_ID IN (?) AND SS.FINAL_GRADE = 4`;

    let ids = [];
    ids.push(parseInt(req.params.studyYearIdRenumbered));

    if (req.params.studyYearIdLastYear != '0') {
        ids.push(parseInt(req.params.studyYearIdLastYear));
    }

    connection.query(getUnpomoted, [ids], function(err, result) {
        if (err) throw err;
        
        res.send(result);
    })
})


router.get('/equate-subjects/:studyYearIdRenumbered/:studyYearIdLastYear', function(req, res) {
    let query = `SELECT DISTINCT(SS.STUDENT_ID) AS student_id, SS.SUBJECT_ID AS subject_id, SS.FINAL_GRADE AS final_grade FROM STUDENT_SUBJECT SS INNER JOIN SUBJECT SJ ON SS.SUBJECT_ID = SJ.ID 
	INNER JOIN STUDENT_INFO SI ON SI.STUDENT_ID = SS.STUDENT_ID 
    WHERE SI.IS_REINMATRICULAT = 1 AND SS.FINAL_GRADE > 4 AND SS.STUDY_YEAR_ID IN (?)`;

    console.log(req.params);
    let ids = [];
    ids.push(parseInt(req.params.studyYearIdRenumbered));

    if (req.params.studyYearIdLastYear != '0') {
        ids.push(parseInt(req.params.studyYearIdLastYear));
    }

    connection.query(query, [ids], function(err, result) {
        if (err) throw err;

        res.send(result);
    })

})

router.post('/add-student-subjects', function(req, res) {

    promiseCreateArray = new Promise(function(resolve, reject) {
        let toSend =  {
            subjects: [],
            subjectGrades: []
        }

        req.body.data.forEach(student => {
            student.subjects.forEach(subject => {
                
                let temp = [];
                temp.push(student.id);
                temp.push(req.body.studyYearId);
                temp.push(subject.id);
                temp.push(subject.hasOwnProperty('grade') ? subject.grade : null);
                
                toSend.subjects.push(temp);

                if (subject.hasOwnProperty('grade')) {
                    let data = [];
                    data.push(student.id);
                    data.push(req.body.studyYearId);
                    data.push(subject.id);
                    data.push(subject.grade);
                    data.push(5);

                    toSend.subjectGrades.push(data);
                } else {
                    
                }
            })
        })
        resolve(toSend);
        reject("Something went wrong.");
    })

    promiseCreateArray.then(function(response, error) {

        let query = 'INSERT INTO STUDENT_SUBJECT (STUDENT_ID, STUDY_YEAR_ID, SUBJECT_ID, FINAL_GRADE) VALUES ?';

        let queryStudentGrades = 'INSERT INTO STUDENT_GRADES (STUDENT_ID, STUDY_YEAR_ID, SUBJECT_ID, GRADE, GRADE_TYPE) VALUES ?';
        
        var sql = connection.query(query, [response.subjects], function(err, result) {
            if (err) throw err;

            if (response.subjectGrades.length > 0) {
                var sql = connection.query(queryStudentGrades, [response.subjectGrades], function(err, result) {
                    if (err) throw err;    
                    
                    let temp = {
                        errorCode: 0,
                        message: 'Student Subjects were added successfuly'
                    }
                    res.send(temp);
                })

            } else {
                let temp = {
                    errorCode: 0,
                    message: 'Student Subjects were added successfuly'
                }
                res.send(temp);
            }
        })
        console.log(sql.sql);        
    })
})
// -------- End Routes For Students Subject ------

router.get('/get-students-assigned-to-subject/:subjectId/:studyYearId', function(req, res) {

    let query = `SELECT DISTINCT(S.ID) AS id, S.STUDENT_NUMBER AS studentNumber, CONCAT(S.FIRST_NAME, ' ', S.LAST_NAME) AS name, SI.GROUP_NAME AS groupName FROM STUDENT S 
                INNER JOIN STUDENT_INFO SI ON S.ID = SI.STUDENT_ID 
                INNER JOIN STUDENT_SUBJECT SS ON SS.STUDENT_ID = S.ID
                WHERE SS.STUDY_YEAR_ID = ? AND SS.SUBJECT_ID = ?`;

    connection.query(query, [req.params.studyYearId, req.params.subjectId], function(err, result) {
        if (err) throw err;
        res.send(result);
    })
})

module.exports = router;