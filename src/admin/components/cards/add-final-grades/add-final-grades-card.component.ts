import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { Router }            from '@angular/router';

import { AdminService } from '../../../services/admin.services';

@Component({
    selector: 'add-final-grades-card',
    templateUrl: './add-final-grades-card.component.html',
    styleUrls: ['./add-final-grades-card.component.less'],
    providers: [AdminService]
})

export class AddFinalGradesCardCardComponent {

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