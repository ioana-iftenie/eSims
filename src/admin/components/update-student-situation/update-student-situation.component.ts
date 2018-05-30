import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { AdminService } from '../../services/admin.services';
import { takeWhile } from 'rxjs/operator/takeWhile';

import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
    selector: 'update-student-situation',
    templateUrl: './update-student-situation.component.html',
    styleUrls: ['./update-student-situation.component.less'],
    providers: [AdminService]
})

export class UpdateStudentSituationComponent {

    alive: boolean;
    ranksArray: any[];
    studyYearsArray: any[];
    universityYearsArray: any[];
    specializesArray: any[];

    studyPlanForm: FormGroup;

    studyYearIdS1: any = null;
    studyYearIdS2: any = null;
    studentsArray: any[];
    
    successMessage: string = null;
    errorMessage: string = null;

    showStudentsTable: boolean = false;

    steps: any = [0, 0, 0, 0, 0, 0, 0];
    showSteps: boolean = false;
    originalStudentSituation: any[];

    nextStudyYearIdS1: any;
    nextStudyYearIdS2: any;

    nextStudyYearIdS1Reinmat: any;
    nextStudyYearIdS2Reinmat: any;

    constructor(private http: HttpClient, private adminService: AdminService, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.alive = true;
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
                    if (this.ranksArray.indexOf(element.rank) === -1) this.ranksArray.push(element.rank);
                    if (this.studyYearsArray.indexOf(element.study_year) === -1) this.studyYearsArray.push(element.study_year);
                    if (this.universityYearsArray.indexOf(element.university_year) === -1) this.universityYearsArray.push(element.university_year);
                    if (this.specializesArray.indexOf(element.name) === -1) this.specializesArray.push(element.name);
                });

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
        studyPlanFormGroup['studyYear'] = [];
        studyPlanFormGroup['rank'] = [];
        studyPlanFormGroup['specialize'] = [];
        studyPlanFormGroup['universityYear'] = [];

        this.studyPlanForm = this.fb.group(studyPlanFormGroup);
    }

    getStudyYearsId(): void {
        this.showStudentsTable = false;
        
        let temp = {
            name: this.studyPlanForm.value['specialize'],
            studyYear: this.studyPlanForm.value['studyYear'],
            rank: this.studyPlanForm.value['rank'],
            universityYear: this.studyPlanForm.value['universityYear'],
        };

        this.adminService.getStudyYearsIdWithoutSemester(temp)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                
                if (response[0].SEMESTER == 1) {
                    this.studyYearIdS1 = response[0].ID;
                    this.studyYearIdS2 = response[1].ID;
                } else {
                    this.studyYearIdS1 = response[1].ID;
                    this.studyYearIdS2 = response[0].ID;
                }

                let uv = temp.universityYear.split(' - ');

                let tempReinmatriculat = {
                    name: this.studyPlanForm.value['specialize'],
                    studyYear: this.studyPlanForm.value['studyYear'],
                    rank: this.studyPlanForm.value['rank'],
                    universityYear: (parseInt(uv[0]) + 1) + ' - ' + (parseInt(uv[1]) + 1)
                }

                this.adminService.getStudyYearsIdWithoutSemester(tempReinmatriculat)
                .takeWhile(() => this.alive)
                .subscribe(
                    response => {
                        if (response[0].SEMESTER == 1) {
                            this.nextStudyYearIdS1Reinmat = response[0].ID;
                            this.nextStudyYearIdS2Reinmat = response[1].ID;
                        } else {
                            this.nextStudyYearIdS1Reinmat = response[1].ID;
                            this.nextStudyYearIdS2Reinmat = response[0].ID;
                        }

                        if (temp.studyYear == '3' && temp.rank == 'B' || temp.studyYear == '2' && temp.rank == 'M') {
                            this.nextStudyYearIdS1 = null;
                            this.nextStudyYearIdS2 = null;
                        } else {
                            let tempNextYear = {
                                name: this.studyPlanForm.value['specialize'],
                                studyYear: parseInt(this.studyPlanForm.value['studyYear']) + 1,
                                rank: this.studyPlanForm.value['rank'],
                                universityYear: (parseInt(uv[0]) + 1) + ' - ' + (parseInt(uv[1]) + 1)
                            }  

                            this.adminService.getStudyYearsIdWithoutSemester(tempNextYear)
                            .takeWhile(() => this.alive)
                            .subscribe(
                                response => {
                                    if (response[0].SEMESTER == 1) {
                                        this.nextStudyYearIdS1 = response[0].ID;
                                        this.nextStudyYearIdS2 = response[1].ID;
                                    } else {
                                        this.nextStudyYearIdS1 = response[1].ID;
                                        this.nextStudyYearIdS2 = response[0].ID;
                                    }
                                },
                                error => {

                                }
                            )
                        }                      
                    },
                    error => {

                    }
                )

                this.showSteps = true;
                this.steps[0] = 1;

            }, error => {
                console.log(error);
            }
        )
    }

    getStudents() {
        this.adminService.getStudentsByStudyYearsId(this.studyYearIdS1, this.studyYearIdS2)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                this.studentsArray = response.map(x => Object.assign({}, x));
                this.showStudentsTable = true;

                this.steps[0] = 0;
                this.steps[1] = 1;

            }, error => {
                console.log(error);
            }
        )
    }

    getSituation() {
        this.adminService.getStudentsSubjectsForEntireYear(this.studyYearIdS1, this.studyYearIdS2)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                this.originalStudentSituation = response.map(x => Object.assign({}, x));

                this.studentsArray.forEach(student => {

                    student.situation = {
                        failed: 0,
                        passed: 0,
                        failedArrayS1: [],
                        failedArrayS2: [],
                        passedArrayS1: [],
                        passedArrayS2: []
                    };

                    response.forEach(subject => {
                        if (student.studentId == subject.studentId) {
                            if (subject.finalGrade >= 5) {
                                student.situation.passed ++;

                                if (subject.semester == 1)  {
                                    student.situation.passedArrayS1.push(subject);
                                } else {
                                    student.situation.passedArrayS2.push(subject);
                                }
                            } else {
                                student.situation.failed ++;

                                if (subject.semester == 1)  {
                                    student.situation.failedArrayS1.push(subject);
                                } else {
                                    student.situation.failedArrayS2.push(subject);
                                }
                            }
                        }
                    })

                    this.steps[1] = 0;
                    this.steps[2] = 1;
                })
            },
            error => {
                console.log(error);
            }
        )
    }

    getNextYearSituation() {
        this.studentsArray.forEach(student => {
            student.toPayArray = [];
                
            let nextStudyYearS1 = student.situation.failed > 5 ? this.nextStudyYearIdS1Reinmat : this.nextStudyYearIdS1;
            let nextStudyYearS2 = student.situation.failed > 5 ? this.nextStudyYearIdS2Reinmat : this.nextStudyYearIdS2;
        
            student.newSituation = {
                isRestantS1: student.situation.failedArrayS1.length > 0 ? 1 : 0,
                nextStudyYearIdS1: nextStudyYearS1,
                nextStudyYearIdS2: nextStudyYearS2,
                isRestantS2: student.situation.failedArrayS2.length > 0 ? 1 : 0,
                isReinmatriculat: student.situation.failed > 5 ? 1 : 0,
                toPayArray: []
            };

            student.situation.failedArrayS1.forEach(situation => {
                let toPay = {
                    debtName : null,
                    studentId: null,
                    studyYearId: null,
                    amount: null,
                    createdDate: null,
                    lastUpdated: null,
                    payUntill: null,
                    isPayed: null
                };

                toPay.debtName = "Debd subject: " + situation.subjectName;
                toPay.studentId = student.studentId;
                toPay.studyYearId = situation.studyYearId;
                toPay.amount = "300 lei";
                let date = new Date();

                let year = date.getFullYear();
                let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth();
                let day = date.getDate() < 9 ? '0' + date.getDate() : date.getDate();
                
                toPay.createdDate = year + '-' + month + '-' + day;
                toPay.lastUpdated = year + '-' + month + '-' + day;
                toPay.payUntill = (year + 1) + '-' + month + '-' + day;
                toPay.isPayed = 0;

                student.newSituation.toPayArray.push(toPay);

            });

            student.situation.failedArrayS2.forEach(situation => {
                let toPay = {
                    debtName : null,
                    studentId: null,
                    studyYearId: null,
                    amount: null,
                    createdDate: null,
                    lastUpdated: null,
                    payUntill: null,
                    isPayed: null
                };

                toPay.debtName = "Debd subject: " + situation.subjectName;
                toPay.studentId = student.studentId;
                toPay.studyYearId = situation.studyYearId;
                toPay.amount = "300 lei";
                let date = new Date();
                toPay.createdDate = date;
                toPay.lastUpdated = date;
                let newDate = new Date();
                newDate.setFullYear(newDate.getFullYear() + 1);
                toPay.payUntill = newDate;
                toPay.isPayed = false;

                student.newSituation.toPayArray.push(toPay);

            });

            this.steps[2] = 0;
            this.steps[3] = 1;
        })

        console.log(this.studentsArray);
    }
    
    updateSituation() {
        let toPayArray = [];
        let updateStudentInfo = [];
        let deleteFinalStudents = [];

        let isFinalYear = false;
        if (this.studyPlanForm.value['studyYear'] == '3' && this.studyPlanForm.value['rank'] =='B' || this.studyPlanForm.value['studyYear'] == '2' && this.studyPlanForm.value['rank'] =='M') {
            isFinalYear = true;
        }

        this.studentsArray.forEach(student => {

            if (isFinalYear == false) {
                let data = [];
                data.push(student.newSituation.nextStudyYearIdS1);
                data.push(student.newSituation.isRestantS1);
                data.push(student.newSituation.isReinmatriculat);
                data.push(student.studentId);
                data.push(this.studyYearIdS1);

                updateStudentInfo.push(data);

                data = [];
                data.push(student.newSituation.nextStudyYearIdS2);
                data.push(student.newSituation.isRestantS2);
                data.push(student.newSituation.isReinmatriculat);
                data.push(student.studentId);
                data.push(this.studyYearIdS2);

                updateStudentInfo.push(data);
            } else {
                if (student.newSituation.isReinmatriculat == 0) {
                    let removeData = [];
                    removeData.push(student.studentId);
                    removeData.push(this.studyYearIdS1);

                    deleteFinalStudents.push(removeData);

                    removeData.push(student.studentId);
                    removeData.push(this.studyYearIdS2);

                    deleteFinalStudents.push(removeData);
                } else {
                    let data = [];
                    data.push(student.newSituation.nextStudyYearIdS1);
                    data.push(student.newSituation.isRestantS1);
                    data.push(student.newSituation.isReinmatriculat);
                    data.push(student.studentId);
                    data.push(this.studyYearIdS1);

                    updateStudentInfo.push(data);

                    data = [];
                    data.push(student.newSituation.nextStudyYearIdS2);
                    data.push(student.newSituation.isRestantS2);
                    data.push(student.newSituation.isReinmatriculat);
                    data.push(student.studentId);
                    data.push(this.studyYearIdS2);

                    updateStudentInfo.push(data);
                }
            }

            student.newSituation.toPayArray.forEach(pay => {
                let temp = [];
                temp.push(pay.debtName);
                temp.push(pay.studentId);
                temp.push(pay.studyYearId);
                temp.push(pay.amount);
                temp.push(pay.createdDate);
                temp.push(pay.lastUpdated);
                temp.push(pay.payUntill);
                temp.push(pay.isPayed);

                toPayArray.push(temp);
            });

        })

        console.log(toPayArray);
        console.log(updateStudentInfo);

        this.adminService.updateStudentsSituation(this.studyYearIdS1, this.studyYearIdS2, updateStudentInfo, deleteFinalStudents, toPayArray, isFinalYear)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {

                if (response.errorCode == 0) {
                    this.successMessage = response.message;
                    this.steps[3] = 0;
                    this.steps[4] = 1;
                }
            },
            error => {

            }
        )
    }
}