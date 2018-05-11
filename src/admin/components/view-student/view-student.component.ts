import { Component, OnInit, ViewChild, ElementRef, Input, ViewChildren } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { Router }            from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AdminService } from '../../services/admin.services';

@Component({
    selector: 'view-student',
    templateUrl: './view-student.component.html',
    styleUrls: ['./view-student.component.less'],
    providers: [AdminService]
})

export class ViewStudentComponent {

    alive: boolean;
   
    errorMessage: string;
    successMessage: string;

    constructor(private http: HttpClient, private adminService: AdminService, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.alive = true;
    }

    ngOnDestroy(): void {
        this.alive = false;
    }
}
