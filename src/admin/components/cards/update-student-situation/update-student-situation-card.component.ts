import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { Router }            from '@angular/router';

import { AdminService } from '../../../services/admin.services';

@Component({
    selector: 'update-student-situation-card',
    templateUrl: './update-student-situation-card.component.html',
    styleUrls: ['./update-student-situation-card.component.less'],
    providers: [AdminService]
})

export class UpdateStudentSituationCardCardComponent {

    alive: boolean;

    constructor(private http: HttpClient, private adminService: AdminService) {
    }

    ngOnInit() {
        this.alive = true;
    }

    ngOnDestroy(): void {
        this.alive = false;
    }
}