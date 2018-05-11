import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { AdminService } from '../../../services/admin.services';
import { takeWhile } from 'rxjs/operator/takeWhile';

import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
    selector: 'view-study-plan',
    templateUrl: './view-study-plan.component.html',
    styleUrls: ['./view-study-plan.component.less'],
    providers: [AdminService]
})

export class ViewStudyPlanComponent {

    alive: boolean;
    semestersArray: any[];
    ranksArray: any[];
    studyYearsArray: any[];
    universityYearsArray: any[];
    specializesArray: any[];

    studyPlanForm: FormGroup;

    studyYearId: any = null;
    subjectArray: any[];

    successMessage: string = null;
    errorMessage: string = null;

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

    searchSubjects(): void {
        this.subjectArray = [];

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
                this.studyYearId = response[0].ID;

                this.adminService.getSubjectsFromStudyPlan(this.studyYearId)
                .takeWhile(() => this.alive)
                .subscribe(
                    response => {
                        console.log(response);
                        this.subjectArray = response;
                    },
                    error => {
                        console.log(error);
                    }
                )
            }, error => {
                console.log(error);
            }
        )
    }
}