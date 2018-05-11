import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { AdminService } from '../../../services/admin.services';
import { takeWhile } from 'rxjs/operator/takeWhile';

import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
    selector: 'student-subject',
    templateUrl: './student-subject.component.html',
    styleUrls: ['./student-subject.component.less'],
    providers: [AdminService]
})

export class AdminStudentSubjectComponent {

    alive: boolean;
    semestersArray: any[];
    ranksArray: any[];
    studyYearsArray: any[];
    universityYearsArray: any[];
    specializesArray: any[];

    studentSubjectForm: FormGroup;

    studyYearId: any = null;
    studentsArray: any[];

    successMessage: string = null;
    errorMessage: string = null;

    disableStudyYearButton: boolean = false;
    disableStudentButton: boolean = false;

    displayStudents: boolean = false;
    currentStep: number = null;

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

                this.studentSubjectForm.get('semester').setValue(this.semestersArray[0]);
                this.studentSubjectForm.get('studyYear').setValue(this.studyYearsArray[0]);
                this.studentSubjectForm.get('rank').setValue(this.ranksArray[0]);
                this.studentSubjectForm.get('universityYear').setValue(this.universityYearsArray[0]);
                this.studentSubjectForm.get('specialize').setValue(this.specializesArray[0]);

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
        
        const studentSubjectFormGroup = {};
        studentSubjectFormGroup['semester'] = []
        studentSubjectFormGroup['studyYear'] = [];
        studentSubjectFormGroup['rank'] = [];
        studentSubjectFormGroup['specialize'] = [];
        studentSubjectFormGroup['universityYear'] = [];

        this.studentSubjectForm = this.fb.group(studentSubjectFormGroup);

    }

    getStudyYearId(): void {

        let temp = {
            name: this.studentSubjectForm.value['specialize'],
            studyYear: this.studentSubjectForm.value['studyYear'],
            rank: this.studentSubjectForm.value['rank'],
            universityYear: this.studentSubjectForm.value['universityYear'],
            semester: this.studentSubjectForm.value['semester']
        };

        this.adminService.getStudyYearId(temp)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                this.studyYearId = response[0].ID;

                this.studentSubjectForm.get('semester').disable();
                this.studentSubjectForm.get('studyYear').disable();
                this.studentSubjectForm.get('rank').disable();
                this.studentSubjectForm.get('universityYear').disable();
                this.studentSubjectForm.get('specialize').disable();

                this.disableStudyYearButton = true;  
                this.currentStep = 2;
            }, error => {
                console.log(error);
            }
        )
    }

    getStudents(): void {
        
        this.adminService.getStudentsByStudyYearId(this.studyYearId)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                console.log(response);
                this.displayStudents = true;
                this.studentsArray = [];
                this.studentsArray = response;
                this.disableStudentButton = true;

                this.currentStep = 3;
            },
            error => {
                console.log(error);
            }
        )
    }

    getStudyPlanSubjects(): void {
        this.adminService.getMandatorySubjectsFromStudyPlan(this.studyYearId)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                console.log(response);
                this.studentsArray.forEach(element => {
                    element.subjects = [];
                    element.subjects = response;
                });
            },
            error => {
                console.log(error);
            }
        )
    }
}