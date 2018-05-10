import { Component, OnInit, ViewChild, ElementRef, Input }  from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl }                           from '@angular/forms';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';

import { AdminService }      from '../../../services/admin.services';

import {IMyDpOptions}        from 'mydatepicker';      
import { User } from '../../../../core/models/user.class';

@Component({
    selector: 'create-update-subject',
    templateUrl: './create-update-subject.component.html',
    styleUrls: ['./create-update-subject.component.less'],
    providers: [AdminService]
})

export class CreateUpdateSubjectComponent {

    alive: boolean;

    searchSubject: string;

    subjectForm: FormGroup;

    displaySubjectCategory: boolean = false;
    displayUpdateButton: boolean = false;
    displaySubjectForm: boolean = false;

    successMessage: string;
    errorMessage: string;

    searchResponse: any[];
    noEdit = false;
    selectedSubjectId: number;

    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd-mm-yyyy',
    };
    private placeholder: string = 'Select a date';

    constructor(private http: HttpClient, private adminService: AdminService, private fb: FormBuilder) {
    }

    @Input()
    userInfo: User;

    ngOnInit() {
        this.alive = true;
        this.createForm();
    }

    createForm() {
        this.noEdit = false;
        
        const subjectFormGroup = {};
        subjectFormGroup['statusInd'] = [true]
        subjectFormGroup['name'] = [null, [Validators.required]];
        subjectFormGroup['points'] = ['5'];
        subjectFormGroup['semester'] = ['1'];
        subjectFormGroup['studyYear'] = ['1'];
        subjectFormGroup['rank'] = ['B'];
        subjectFormGroup['examDate'] = [null, [Validators.required]];
        subjectFormGroup['isMandatory'] = ['1']
        subjectFormGroup['subjectCategory'] = ['CO2']
        subjectFormGroup['specialize'] = ['I']

        this.subjectForm = this.fb.group(subjectFormGroup);

        this.subjectForm.valueChanges
        .takeWhile(() => this.alive)
        .subscribe(data => this.onValueChanged(this.subjectForm, data));

        this.onValueChanged(this.subjectForm);
    }

    resetFormElements() {
        this.subjectForm.get('name').setValue(null);
        this.subjectForm.get('name').setValidators(Validators.required);
        this.subjectForm.get('name').enable();
        this.subjectForm.get('points').setValue('5');
        this.subjectForm.get('points').enable();
        this.subjectForm.get('semester').setValue('1');
        this.subjectForm.get('semester').enable();
        this.subjectForm.get('studyYear').setValue('1');
        this.subjectForm.get('studyYear').enable();
        this.subjectForm.get('rank').setValue('B');
        this.subjectForm.get('rank').enable();
        this.subjectForm.get('examDate').setValue(null);
        this.subjectForm.get('examDate').setValidators(Validators.required);
        this.subjectForm.get('examDate').enable();
        this.subjectForm.get('isMandatory').setValue('1');
        this.subjectForm.get('isMandatory').enable();
        this.subjectForm.get('specialize').setValue('I');
        this.subjectForm.get('specialize').enable();
        this.subjectForm.get('subjectCategory').setValue('CO2');
        this.subjectForm.get('subjectCategory').enable();

        this.subjectForm.get('statusInd').setValue(true);
    }

    disableFormElements(response: any) {
        this.subjectForm.get('name').setValue(response.name);
        this.subjectForm.get('name').disable();
        this.subjectForm.get('points').setValue(response.points);
        this.subjectForm.get('points').disable();
        this.subjectForm.get('semester').setValue(response.semester);
        this.subjectForm.get('semester').disable();
        this.subjectForm.get('studyYear').setValue(response.study_year);
        this.subjectForm.get('studyYear').disable();
        this.subjectForm.get('rank').setValue(response.rank);
        this.subjectForm.get('rank').disable();
        this.subjectForm.get('examDate').setValue(response.date_exam);
        this.subjectForm.get('examDate').disable();
        this.subjectForm.get('isMandatory').setValue(response.is_mandatory);
        this.subjectForm.get('isMandatory').disable();
        this.subjectForm.get('specialize').setValue(response.specialize);
        this.subjectForm.get('specialize').disable();

        this.subjectForm.get('statusInd').setValue(response.status_ind);

        if (response.is_mandatory == 0) {
            this.subjectForm.get('subjectCategory').setValue(response.optional_group);
            this.subjectForm.get('subjectCategory').disable();

            this.displaySubjectCategory = true;
        } else {
            this.displaySubjectCategory = false;
        }

        this.displayUpdateButton = true;
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    searchSubjects(): void {
        this.searchResponse = null;

        if (this.searchSubject.length > 1) {
            this.adminService.searchSubjects(this.searchSubject, false)
            .takeWhile(() => this.alive)
            .subscribe(
                response => {             
                    this.searchResponse = [];
                    this.searchResponse = response;
                },
                error => {
                    console.log(error)
                }
            );
        }
    }

    selectedSubject(subjectId: any): void {
        this.displaySubjectForm = true;

        this.successMessage = null;
        this.errorMessage = null;

        this.searchResponse = null;
        this.searchSubject = '';
        this.displaySubjectCategory = false;

        this.adminService.getSubject(subjectId)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {             
                this.disableFormElements(response[0]);
                this.selectedSubjectId = response[0].id;
            },
            error => {
                console.log(error)
            }
        );
    }
    updateSubject() {

        let temp = {
            id: this.selectedSubjectId,
            statusInd: this.subjectForm.value['statusInd']
        }

        this.adminService.updateSubject(temp)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                if(response.errorCode == 0) {
                    this.successMessage = response.message;
                }
            },
            error => {
                console.log(error);
            }
        )
    }

    showSubjectForm(): void {
        this.displaySubjectForm = true;
        this.resetFormElements()
        this.displayUpdateButton = false;
    }

    addSubject(): void {
        this.successMessage = null;
        this.errorMessage = null;

        this.markAsDirty(this.subjectForm);
        this.onValueChanged(this.subjectForm);  
        
        if (this.subjectForm.valid) {

            let temp = {
                name: this.subjectForm.value['name'],
                points: this.subjectForm.value['points'],
                semester: this.subjectForm.value['semester'],
                studyYear: this.subjectForm.value['studyYear'],
                rank: this.subjectForm.value['rank'],
                examDate: this.subjectForm.value['examDate'],
                isMandatory: this.subjectForm.value['isMandatory'] == 1 ? true : false,
                subjectCategory: this.subjectForm.value['subjectCategory'],
                specialize: this.subjectForm.value['specialize']
            }
            
            this.subjectForm.reset();

            this.adminService.createSubject(temp)
            .takeWhile(() => this.alive)
            .subscribe(
                response => {             
                    if (response.errorCode == 0) {
                        this.successMessage = response.message;
                    } else {
                        this.errorMessage = response.message;
                    }
                    this.createForm();
                },
                error => {
                    console.log(error)
                }
            );
        }
    }

    onChangeMandatory(): void {
        if (this.subjectForm.value['isMandatory'] == 0) {
            this.displaySubjectCategory = true;
        } else {
            this.displaySubjectCategory = false;
            this.subjectForm.value['subjectCategory'] = null;
        }
    }

    formErrors = {
        'name': '',
        'examDate': ''
    };

    validationMessages = {
        'name': {
            'required': 'Subject name is required.',
        },
        'examDate': {
            'required': 'Exam date is required.',
        }
    };

    onValueChanged(group: FormGroup, data?: any): void {
        if (!group) {
            return;
        }

        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = group.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];

                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    markAsDirty(group: FormGroup): void {
        group.markAsTouched();
        group.markAsDirty();

        for (let i in group.controls) {
            if (group.controls[i] instanceof FormControl) {
                group.controls[i].markAsTouched();
                group.controls[i].markAsDirty();
            } else {
                group.controls[i].markAsDirty();
            }
        }
    }
}