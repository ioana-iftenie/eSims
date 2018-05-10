const cron =       require('node-cron');
const connection = require('../connection');
 
//Jobul va rula pe la minutul scris pe prima pozitie.
// const task = cron.schedule('19 * * * *', function() { 

//Jobul va rula pe 1 Ianuarie, in fiecare an.
const task = cron.schedule('0 * 1 1 *', function() { 
    let queryGetSpecialize = 'SELECT * FROM SPECIALIZE WHERE STATUS_IND = 1';
    let queryInsertStudyYEar = 'INSERT INTO STUDY_YEAR (UNIVERSITY_YEAR, SEMESTER, SPECIALIZE_ID) VALUES ?';

    let studyYears = [];
    let semesters = [1, 2];
    
    connection.query(queryGetSpecialize, function(error, specializes) {
        if (error) throw(error)

        promiseStudyYears = new Promise(function(resolve, reject) {
            semesters.forEach(semester => {
                specializes.forEach(specialize => {
                    let temp = [];

                    let newYear = new Date();
                    // let newYearString = '2017 - 2018';
                    let newYearString = newYear.getFullYear() + ' - ' + parseInt(newYear.getFullYear() + 1);
                    temp.push(newYearString.toString());
                    temp.push(semester.toString());
                    temp.push(specialize.id);

                    studyYears.push(temp);
                });
            })

            resolve(studyYears);
            reject("Something went wrong.");
        })

        promiseStudyYears.then(function(response) {
            var query = connection.query(queryInsertStudyYEar, [response], function(error, insertResponse) {
                if (error) throw error;

                console.log("Cronjob for inserting into STUDY_YEAR has successfuly finished with response: ");
                console.log(insertResponse);
            })

            console.log(query.sql)
        })
    })
});

task.start();