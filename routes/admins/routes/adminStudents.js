const app = require('../../../bin/www');
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bodyParser = require('body-parser');
const multer  = require('multer');
const fs = require('fs');
const XLSX = require('xlsx')
var mysql = require('mysql');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../server-uploads/')
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage}).single('importStudentsFile');

const connection = require('../../connection');

router.post('/import-students', function(req, res, next) {
    
    upload(req, res, function(err) {
        if (err) {
            throw err;
        }
        
        var workbook = XLSX.readFile(req.file.path);
        const workSheetName = workbook.SheetNames[0];
        const workSheet = workbook.Sheets[workSheetName];

        var data = XLSX.utils.sheet_to_json(workbook.Sheets[workSheetName]);

        let header = ['student_number', 'first_name', 'last_name', 'mother_name', 'father_name', 'date_of_birth', 'email',
                      'webmail', 'phone', 'nationality', 'citizenship','gender', 'cnp', 'sign_up_mark', 'language_id', 
                      'study_year_id', 'group'];

        promiseWrongRows = new Promise(function(resolve, reject) {
            let wrongRows = [];

            data.forEach((student) => {
                for (let key in header) {
                    if (!student.hasOwnProperty(header[key])) {
                        wrongRows.push(student);
                        return;
                    }
                }
            });

            resolve(wrongRows);
            reject("Something went wrong.");
        })

        promiseWrongRows.then(function(response) {

            if (response.length == 0) {

                let studentTable = [];
                let userTable = [];

                promiseBulkInsert = new Promise(function(resolve, reject) {
                    let responseToSend = {};

                    data.forEach((student) => {                      
                        
                        let studentTemp = {
                            student_number: student.student_number,
                            first_name: student.first_name,
                            last_name: student.last_name,
                            mother_name: student.mother_name,
                            father_name: student.father_name,
                            date_of_birth: student.date_of_birth,
                            email: student.email,
                            webmail: student.webmail,
                            phone: student.phone,
                            nationality: student.nationality,
                            citizenship: student.citizenship,
                            gender: student.gender,
                            cnp: student.cnp,
                            sign_up_mark: student.sign_up_mark,
                            language_id: student.language_id
                        };
                        studentTable.push(studentTemp);

                        connection.beginTransaction(function(err) {
                            if (err) { throw err; }

                            connection.query('INSERT INTO STUDENT SET ?', studentTemp, function(err, result) {
                                if (err) { 
                                    connection.rollback(function() {
                                        throw err;

                                        responseToSend = {
                                            errorCode: 1,
                                            message: 'Cound not insert student into table!'
                                        }
                                    });
                                } else {
                                    let studentId = result.insertId;
                                    
                                    let userTemp = {
                                        username: student.student_number,
                                        password: "student",
                                        outer_id: studentId,
                                        is_admin: 0,
                                        is_student: 1,
                                        is_professor: 0,
                                        created_date: new Date().toLocaleString(),
                                        last_updated: new Date().toLocaleString()
                                    };

                                    connection.query('INSERT INTO USER SET ?', userTemp, function(errUser, resultUser) {
                                        if (errUser) { 
                                            connection.rollback(function() {
                                                throw errUser;

                                                responseToSend = {
                                                    errorCode: 1,
                                                    message: 'Cound not insert user in table!'
                                                }
                                                
                                            });
                                        } else {
                                            let studentInfoTemp = []
                                            let temp = [];
                                            temp.push(studentId, parseInt(student.study_year_id.split(', ')[0]), 0, 0, 0, null, 0, student.group);
                                            studentInfoTemp.push(temp);
                                            temp = [];
                                            temp.push(studentId, parseInt(student.study_year_id.split(', ')[1]), 0, 0, 0, null, 0, student.group);
                                            studentInfoTemp.push(temp);

                                            connection.query('INSERT INTO STUDENT_INFO (STUDENT_ID, STUDY_YEAR_ID, IS_BURSIER, IS_EXMATRICULAT, IS_RESTANT, IS_BUGETAR, IS_REINMATRICULAT, GROUP_NAME) VALUES ?', [studentInfoTemp], function(errStudentInfo, resultStudentInfo) {
                                                if (errStudentInfo) { 
                                                    connection.rollback(function() {
                                                        throw errStudentInfo;

                                                        responseToSend = {
                                                            errorCode: 1,
                                                            message: 'Cound not insert into STUDENT_INFO table!'
                                                        }
                                                    });
                                                } else {
                                                    connection.commit(function(errOnCommit) {
                                                        if (errOnCommit) { 
                                                        connection.rollback(function() {
                                                            throw errOnCommit;

                                                            responseToSend = {
                                                                errorCode: 1,
                                                                message: 'Cound not commit!'
                                                            }
                                                            
                                                        });
                                                        }
                                                        console.log('Transaction Complete.');

                                                        responseToSend = {
                                                            errorCode: 0,
                                                            message: 'Students were imported successfully!'
                                                        }
                                                        connection.end();
                                                    });
                                                }
                                            })
                                        }  
                                    })
                                }
                            })
                        })
                    })

                    resolve(responseToSend);
                    reject("Insert went wrong");
                })

                promiseBulkInsert.then(function(response) {
                    if (response != null) {
                        res.send(response);
                    }
                })
            } else {
                let temp = {
                    header: header,
                    wrongRows: response,
                    message: 'There cannot be empty columns!',
                    errorCode: 2
                }
                res.send(temp);
            }
            
        }).catch(function(error) {
            console.log(error);
        })
    })
})

router.get('/get-pre-final-grades/:studyYearId', function(req, res) {
    let queryGetStudents = `SELECT SI.ID AS originalId, S.ID AS studentId, S.STUDENT_NUMBER AS studentNumber, CONCAT(S.FIRST_NAME, ' ', S.LAST_NAME) AS studentName 
    , SI.IS_REINMATRICULAT AS isReinmatriculat, SI.IS_RESTANT AS isRestant FROM STUDENT_INFO SI 
    INNER JOIN STUDENT S ON SI.STUDENT_ID = S.ID WHERE SI.STUDY_YEAR_ID = ?`;
    let queryGetSubjects = `SELECT DISTINCT(SS.ID) AS originalId, SI.STUDENT_ID AS studentId, SS.SUBJECT_ID AS subjectId, SJ.NAME AS subjectName
    FROM STUDENT_INFO SI INNER JOIN STUDENT_SUBJECT SS ON SI.STUDENT_ID = SS.STUDENT_ID
    INNER JOIN SUBJECT SJ ON SS.SUBJECT_ID = SJ.ID WHERE SS.STUDY_YEAR_ID = ? ORDER BY SI.STUDENT_ID`;
    let queryGetGrades = `SELECT S.ID AS studentId, SJ.ID AS subjectId, SG.GRADE AS finalGrade
    FROM STUDENT_GRADES SG INNER JOIN STUDENT S ON SG.STUDENT_ID = S.ID INNER JOIN SUBJECT SJ ON SG.SUBJECT_ID = SJ.ID WHERE 
    SG.STUDY_YEAR_ID = ? AND SG.GRADE_TYPE = (SELECT ID FROM MARK_TYPE WHERE NAME LIKE "%FINAL GRADE%")`;

    let toSend = {
        students: [],
        subjects: [],
        grades: []
    }

    connection.query(queryGetStudents, [req.params.studyYearId], function(err, result) {
        if (err) throw err;

        toSend.students = result;

        connection.query(queryGetSubjects, [req.params.studyYearId], function(err, result) {

            if (err) throw err;
            toSend.subjects = result;

            connection.query(queryGetGrades, [req.params.studyYearId], function(err, result) {
                if (err) throw err;

                toSend.grades = result;

                res.send(toSend);
            })
        })
    })
})

router.post('/add-final-grades', function(req, res) {
    promiseQuery = new Promise(function(resolve, reject) {

        let queries = '';

        req.body.finalGrades.forEach(function (item) {
            queries += mysql.format("UPDATE student_subject SET final_grade = ? WHERE id = ?; ", item);
        });
    
        resolve(queries);
        reject("Something went wrong.");
    })

    promiseQuery.then(function(response) {

        connection.query(response, function(err, result) {
            if (err) throw err;

            res.send(result);
        });  
    })  
})

// -------- Start Routes for Updating Student -------

router.post('/get-study-years-without-semester', function(req, res) {
    let query = 'SELECT SY.ID, SY.SEMESTER FROM STUDY_YEAR SY INNER JOIN (SELECT ID FROM SPECIALIZE S WHERE S.NAME = ? AND STUDY_YEAR = ? AND RANK = ?) S ON SY.SPECIALIZE_ID = S.ID WHERE SY.UNIVERSITY_YEAR = ?';

    connection.query(query, [req.body.name, req.body.studyYear, req.body.rank, req.body.universityYear, req.body.semester], function(err, result) {
        if (err) throw err;
        
        res.send(result);
    })
})

router.get('/get-students-by-study-years/:studyYearS1/:StidyYearS2', function(req, res) {
    let queryGetStudents = `SELECT DISTINCT(S.ID) AS studentId, S.STUDENT_NUMBER AS studentNumber, 
    CONCAT(S.FIRST_NAME, ' ', S.LAST_NAME) AS studentName FROM STUDENT_INFO SI 
    INNER JOIN STUDENT S ON SI.STUDENT_ID = S.ID WHERE SI.STUDY_YEAR_ID = ? OR SI.STUDY_YEAR_ID = ?`;

    connection.query(queryGetStudents, [req.params.studyYearS1, req.params.studyYearS2], function(err, result) {
        if (err) throw err;

        res.send(result);
    })
})

router.get('/get-students-subjects-full-year/:studyYearS1/:studyYearS2', function(req, res) {
    let query = `SELECT SS.STUDENT_ID AS studentId, SS.STUDY_YEAR_ID AS studyYearId, SS.SUBJECT_ID AS subjectId, 
    SS.FINAL_GRADE AS finalGrade, S.NAME AS subjectName, SY.SEMESTER AS semester 
    FROM STUDENT_SUBJECT SS INNER JOIN STUDY_YEAR SY ON SS.STUDY_YEAR_ID = SY.ID
    INNER JOIN SUBJECT S ON SS.SUBJECT_ID = S.ID 
    WHERE STUDY_YEAR_ID = ? OR STUDY_YEAR_ID = ?`;

    connection.query(query, [req.params.studyYearS1, req.params.studyYearS2], function(err, result) {
        if (err) throw err;

        res.send(result);
    })
})

router.post('/update-students-situation', function(req, res) {
    let insertToPay = `INSERT INTO TO_PAY (NAME, STUDENT_ID, STUDY_YEAR_ID, AMOUNT, CREATED_DATE, LAST_UPDATES, PAY_UNTILL, IS_PAYED) VALUES ?`;

    let insertAuditQuery = `INSERT INTO STUDENT_INFO_AUDIT  (STUDENT_ID, STUDY_YEAR_ID, IS_BURSIER, IS_EXMATRICULAT, IS_RESTANT, IS_BUGETAR, IS_REINMATRICULAT, GROUP_NAME) 
    SELECT STUDENT_ID, STUDY_YEAR_ID, IS_BURSIER, IS_EXMATRICULAT, IS_RESTANT, IS_BUGETAR, IS_REINMATRICULAT, GROUP_NAME FROM STUDENT_INFO  SI WHERE SI.STUDY_YEAR_ID = ? OR SI.STUDY_YEAR_ID = ?`;

    let deleteStudentsQuery = `DELETE FROM STUDENT_INFO WHERE (STUDY_YEAR_ID, STUDENT_ID) IN (?)`;

    promiseQuery = new Promise(function(resolve, reject) {

        let queries = '';

        req.body.updatedStudentsInfo.forEach(function (item) {
            queries += mysql.format("UPDATE STUDENT_INFO SET STUDY_YEAR_ID = ?, IS_RESTANT = ?, IS_REINMATRICULAT = ? WHERE STUDENT_ID = ? AND STUDY_YEAR_ID = ?; ", item);
        });
    
        resolve(queries);
        reject("Something went wrong.");
    })

    promiseQuery.then(function(response) {

        connection.query(insertToPay, [req.body.toPay], function(err, result) {
            if (err) throw err;

            if (req.body.isFinalYear == true) {
                connection.query(insertAuditQuery, [req.body.studyYearIdS1, req.body.studyYearIdS2], function(err, result) {
                    if (err) throw err;

                    connection.query(deleteStudentsQuery, [req.body.deleteFinalStudents], function(err, result) {
                        if (err) throw err;

                        connection.query(response, function(err, result) {
                            if (err) throw err;
                
                            let toSend = {
                                errorCode: 0,
                                message: 'Student Info was updated successfuly and the students in final year were deleted.'
                            }

                            res.send(toSend);
                        });  
                    })
                })
            } else {
                connection.query(insertAuditQuery, [req.body.studyYearIdS1, req.body.studyYearIdS2], function(err, result) {
                    if (err) throw err;

                    connection.query(response, function(err, result) {
                        if (err) throw err;
            
                        let toSend = {
                            errorCode: 0,
                            message: 'Student Info was updated successfuly.'
                        }

                        res.send(toSend);
                    });  
                });
            }
        })
    })  

})

// -------- End Routes for Updating Student ---------

router.get('/search-student/:searchString', function(req, res) {
    let query = `SELECT ID AS id, CONCAT(FIRST_NAME , ' ', LAST_NAME) AS name, STUDENT_NUMBER AS studentNumber 
    FROM STUDENT WHERE FIRST_NAME LIKE ? OR LAST_NAME LIKE ?`;

    connection.query(query, ['%' + req.params.searchString + '%', '%' + req.params.searchString + '%'], function(err, result) {
        if (err) throw err;

        res.send(result);
    })
})

router.get('/get-student-info/:studentId', function(req, res) {
    let queryGetStudent = `SELECT *, L.NAME AS languageName FROM STUDENT  S INNER JOIN LANGUAGE L ON L.ID = S.LANGUAGE_ID WHERE S.ID = ?`
    let queryGetStudentInfo = `SELECT * FROM STUDENT_INFO SI INNER JOIN STUDY_YEAR SY ON SY.ID = SI.STUDY_YEAR_ID 
    INNER JOIN SPECIALIZE S ON S.ID = SY.SPECIALIZE_ID WHERE SI.STUDENT_ID = ?`;
    let queryGetStudentInfoAudit = `SELECT * FROM STUDENT_INFO_AUDIT SI INNER JOIN STUDY_YEAR SY ON SY.ID = SI.STUDY_YEAR_ID 
    INNER JOIN SPECIALIZE S ON S.ID = SY.SPECIALIZE_ID WHERE SI.STUDENT_ID = ?`;
    let queryGetStudentSubjects = `SELECT SS.ID AS originalId, SS.SUBJECT_ID AS subjectId, SS.STUDENT_ID AS studentId, SS.STUDY_YEAR_ID AS studyYearId, SS.FINAL_GRADE AS finalGrade, SJ.NAME AS subjectName 
    FROM STUDENT_SUBJECT SS INNER JOIN SUBJECT SJ ON SJ.ID = SS.SUBJECT_ID 
    WHERE SS.STUDENT_ID = ? ORDER BY SS.STUDY_YEAR_ID`;
    let queryGetStudentGrades = `SELECT SG.ID AS originalId, SG.STUDENT_ID AS studentId, SG.SUBJECT_ID AS subjectId,
    SG.STUDY_YEAR_ID AS studyYearId, SG.GRADE AS grade, MT.NAME AS markType 
    FROM STUDENT_GRADES SG INNER JOIN MARK_TYPE MT ON SG.GRADE_TYPE = MT.ID 
    WHERE SG.STUDENT_ID = ? ORDER BY SG.STUDY_YEAR_ID`;
    let queryGetStudentToPay = `SELECT * FROM TO_PAY WHERE STUDENT_ID = ?`;
    
    let data = {
        student: null,
        studentInfo: null,
        studentInfoAudit: null,
        studentSubjects: null,
        studentGrades: null,
        studentToPay: null
    };

    
    connection.query(queryGetStudent, [req.params.studentId], function(err, result) {
        if (err) throw err;

        data.student = result;

        connection.query(queryGetStudentInfo, [req.params.studentId], function(err, result) {
            if (err) throw err;

            data.studentInfo = result;

            connection.query(queryGetStudentInfoAudit, [req.params.studentId], function(err, result) {
                if (err) throw err;
    
                data.studentInfoAudit = result;
             
                connection.query(queryGetStudentSubjects, [req.params.studentId], function(err, result) {
                    if (err) throw err;
        
                    data.studentSubjects = result;
                    
                    connection.query(queryGetStudentGrades, [req.params.studentId], function(err, result) {
                        if (err) throw err;
            
                        data.studentGrades = result;
                        
                        connection.query(queryGetStudentToPay, [req.params.studentId], function(err, result) {
                            if (err) throw err;
                
                            data.studentToPay = result;
                            
                            res.send(data);
                        })
                        
                    })  
                })
            })
        })
    })
})

router.post('/update-student-info', function(req, res) {
    let query = `UPDATE STUDENT SET FIRST_NAME = ?, LAST_NAME = ?, MOTHER_NAME = ?, FATHER_NAME = ?, EMAIL = ?, PHONE = ? WHERE ID = ?`;
    
    connection.query(query, [req.body.studentInfo.firstName, req.body.studentInfo.lastName, req.body.studentInfo.motherName, req.body.studentInfo.fatherName, req.body.studentInfo.email, req.body.studentInfo.phone, req.body.studentId], function(err, result) {
        if (err) throw err;

        res.send(result);
    })
})

module.exports = router;