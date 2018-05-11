const app = require('../../../bin/www');
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bodyParser = require('body-parser');
const multer  = require('multer');
const fs = require('fs');
const XLSX = require('xlsx')

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
                                        
                                        res.send(responseToSend);
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
                                                            
                                                            // res.send(responseToSend);
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

                console.log(response);

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

module.exports = router;