import { Component, OnInit, ViewChild, ElementRef, Input, ViewChildren } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { Router }            from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AdminService } from '../../services/admin.services';

@Component({
    selector: 'generate-groups',
    templateUrl: './generate-groups.component.html',
    styleUrls: ['./generate-groups.component.less'],
    providers: [AdminService]
})

export class GenerateGroupsComponent {

    alive: boolean;
    universityYearDr: any[];
    universityYear: string;
    studyYear: string;
    rank: string;
    type: string;
    language: string;
    specialize: string;
    groups: any[];
    displayGroups: boolean;

    noGroupsMidyearA: any;
    noGroupsMidyearB: any;

    groupsA: any[];
    groupsB: any[];

    groupNameForm: FormGroup;
    generalGroupInfo: any;

    errorMessage: string;
    successMessage: string;

    constructor(private http: HttpClient, private adminService: AdminService, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.alive = true;
        this.universityYear = "0";
        this.universityYearDr = [];

        // this.studyYear = "0";
        // this.rank = "0";
        // this.type = "0";
        // this.language = "0";
        // this.specialize = "0";

        this.studyYear = "1";
        this.rank = "L";
        this.type = "N";
        this.language = "ro";
        this.specialize = "informatica";

        this.displayGroups = false;

        this.groupsA = [];
        this.groupsB = [];

        let date = new Date();
        let currentYear = date.getFullYear();

        for (let i = currentYear - 2; i <= currentYear + 3; i++) {
            this.universityYearDr.push(i - 1 + "-" + i);
        }

        const groupNameFormGroup = {};
        groupNameFormGroup['groupA'] = [];
        groupNameFormGroup['groupB'] = [];

        this.groupNameForm = this.fb.group(groupNameFormGroup);
    }

    onChangeOptions(): void {
        this.groups = [];

        if (this.rank != "0" && this.universityYear != "0" && this.studyYear != "0" && this.type != "0" && this.language != "0" && this.specialize != "0") {
            this.groups = [];

            this.displayGroups = true;
            
            this.generalGroupInfo = {
                university_year: this.universityYear,
                study_year: this.studyYear,
                type: this.type,
                rank: this.rank,
                language: this.language,
                specialize: this.specialize
            }

        } else {
            this.displayGroups = false;
        }
    }

    deleteGroup(midyear: any, index: number): void {
        if (midyear == 1) {
            this.groupsA.splice(index, 1);
        } else {
            this.groupsB.splice(index, 1);
        }
    }

    addGroup(midyear: any): void {
        console.log(this.groupNameForm)
        if (midyear === 1) {
            if (this.groupNameForm.value.groupA != null && this.groupNameForm.value.groupA.length > 0) {
                this.groupsA.push(this.groupNameForm.value.groupA);
            }

        } else {
            if (this.groupNameForm.value.groupB != null && this.groupNameForm.value.groupB.length > 0) {  
                this.groupsB.push(this.groupNameForm.value.groupB);
            }
        }

        this.groupNameForm.reset();
    }

    createGroups(): void {

        this.errorMessage = "";
        this.successMessage = "";

        this.adminService.generateGroups(this.groupsA, this.groupsB, this.generalGroupInfo)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {             
                console.log(response);
                if (response.errorCode == 0) {
                    this.groupsA = [];
                    this.groupsB = [];

                    this.successMessage = response.message;
                }
                if (response.errorCode == 1) {
                    this.groupsA = [];
                    this.groupsB = [];

                    this.errorMessage = response.message;
                }
            },
            error => {
                this.errorMessage = error;
                console.log(error)
            }
        );
        
    }

    ngOnDestroy(): void {
        this.alive = false;
    }
}
