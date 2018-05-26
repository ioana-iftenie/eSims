import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { AdminService } from '../../services/admin.services';
import { takeWhile } from 'rxjs/operator/takeWhile';

import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
    selector: 'add-final-grades',
    templateUrl: './add-final-grades.component.html',
    styleUrls: ['./add-final-grades.component.less'],
    providers: [AdminService]
})

export class AddFinalGradesComponent {

    alive: boolean;
    semestersArray: any[];
    ranksArray: any[];
    studyYearsArray: any[];
    universityYearsArray: any[];
    specializesArray: any[];

    studyPlanForm: FormGroup;

    studyYearId: any = null;
    studentGradesArray: any[];
    
    successMessage: string = null;
    errorMessage: string = null;

    showStudentsTable: boolean = false;
    viewOnly: boolean = false;

    constructor(private http: HttpClient, private adminService: AdminService, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.alive = true;
        this.semestersArray = [];
        this.ranksArray = [];
        this.studyYearsArray = [];
        this.universityYearsArray = [];
        this.specializesArray = [];
        this.createForm();

        this.adminService.getStudyYears()
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                response.forEach(element => {
                    if (this.semestersArray.indexOf(element.semester) === -1) this.semestersArray.push(element.semester);
                    if (this.ranksArray.indexOf(element.rank) === -1) this.ranksArray.push(element.rank);
                    if (this.studyYearsArray.indexOf(element.study_year) === -1) this.studyYearsArray.push(element.study_year);
                    if (this.universityYearsArray.indexOf(element.university_year) === -1) this.universityYearsArray.push(element.university_year);
                    if (this.specializesArray.indexOf(element.name) === -1) this.specializesArray.push(element.name);
                });

                this.studyPlanForm.get('semester').setValue(this.semestersArray[0]);
                this.studyPlanForm.get('studyYear').setValue(this.studyYearsArray[0]);
                this.studyPlanForm.get('rank').setValue(this.ranksArray[0]);
                this.studyPlanForm.get('universityYear').setValue(this.universityYearsArray[0]);
                this.studyPlanForm.get('specialize').setValue(this.specializesArray[0]);

            },
            error => {
                console.log(error);
            }
        )
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    createForm() {
        
        const studyPlanFormGroup = {};
        studyPlanFormGroup['semester'] = []
        studyPlanFormGroup['studyYear'] = [];
        studyPlanFormGroup['rank'] = [];
        studyPlanFormGroup['specialize'] = [];
        studyPlanFormGroup['universityYear'] = [];

        this.studyPlanForm = this.fb.group(studyPlanFormGroup);
    }

    getStudentsAndGrades(): void {
        this.showStudentsTable = false;
        
        let temp = {
            name: this.studyPlanForm.value['specialize'],
            studyYear: this.studyPlanForm.value['studyYear'],
            rank: this.studyPlanForm.value['rank'],
            universityYear: this.studyPlanForm.value['universityYear'],
            semester: this.studyPlanForm.value['semester']
        };

        this.adminService.getStudyYearId(temp)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                if (response != null && response != undefined) {
                    this.studyYearId = response[0].ID;

                    this.adminService.getFianalStudentGrades(this.studyYearId)
                    .takeWhile(() => this.alive)
                    .subscribe(
                        response => {
                            this.studentGradesArray = [];
                            this.studentGradesArray = response.students.map(x => Object.assign({}, x));

                            this.studentGradesArray.forEach(student => {
                                student.subjects = [];

                                response.subjects.forEach(subject => {
                                    if (student.studentId == subject.studentId) {
                                        student.subjects.push(subject);
                                    }
                                })
                            });

                            this.studentGradesArray.forEach(student => {
                                response.grades.forEach(grade => {
                                    if (student.studentId == grade.studentId) {
                                        student.subjects.forEach(subject => {
                                            if (subject.subjectId == grade.subjectId) {
                                                subject.finalGrade = grade.finalGrade;
                                            }
                                        })
                                    }
                                })
                            })

                            this.showStudentsTable = true;
                            this.viewOnly = false;
                        },
                        error => {

                        }
                    )
                } else {
                    this.errorMessage = "Something went wrong. The studyYearId was not found.";
                }
            }, error => {
                console.log(error);
            }
        )
    }

    addFinalGrades() {
        // let restantStudentsArray = [];
        // let reinmatriculatStudentsArray = [];
        // let updateRestantSubjects = [];
        // let toPayArray = [];

        // this.studentGradesArray.forEach(student => {
        //     let fails = 0;
        //     student.subjects.forEach(subject => {
        //         if (subject.finalGrade == undefined || subject.finalGrade <=4) {
        //             fails ++;

        //             let toPay = [];
        //             let debtName = "Debd subject: " + subject.subjectName;
        //             toPay.push(debtName);
        //             toPay.push(student.studentId);
        //             toPay.push(this.studyYearId);
        //             toPay.push("300 lei");
        //             let date = new Date();
        //             toPay.push(date);
        //             toPay.push(date);
        //             let newDate = new Date();
        //             newDate.setFullYear(newDate.getFullYear() + 1);
        //             toPay.push(newDate);
        //             toPay.push(false);

        //             toPayArray.push(toPay);
        //         }
        //         if (subject.finalGrade == undefined) {
        //             subject.finalGrade = "4";
        //         }
        //         let temp = [];
        //         temp.push(subject.originalId);
        //         temp.push(subject.finalGrade);
        //         studentFinalGradesArray.push(temp);

        //         if (student.isRestant) {
        //             let temp = [];
        //             temp.push(subject.subjectId);
        //             temp.push(subject.studentId);
        //             temp.push(subject.finalGrade);
        //             updateRestantSubjects.push(temp);
        //         }
        //     })            

        //     if (fails > 5) {
        //         reinmatriculatStudentsArray.push(student.originalId);

        //     }
        //     if (fails > 0 && fails < 5) {
        //         restantStudentsArray.push(student.originalId);
        //     }
        // })

        // console.log(restantStudentsArray);
        // console.log(reinmatriculatStudentsArray);
        // console.log(updateRestantSubjects);
        // console.log(studentFinalGradesArray);
        // console.log(toPayArray);

        let studentFinalGradesArray = [];
        this.studentGradesArray.forEach(student => {
            student.subjects.forEach(subject => {
                let temp = [];
                temp.push(subject.finalGrade != null ? subject.finalGrade : "4");
                temp.push(subject.originalId);

                studentFinalGradesArray.push(temp);
            })
        })
        this.adminService.addFinalStudentGrades(studentFinalGradesArray)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {   
                this.successMessage = "Students Grades have been successfuly updated";
                this.showStudentsTable = false;
            },
            error => {
                console.log(error);
            }     
        )
    }

    viewStudentsGrades() {
        this.getStudentsAndGrades();
        this.viewOnly = true;

    }
}