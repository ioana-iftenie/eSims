import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';

@Component({
    selector: 'view-all-subjects-card',
    templateUrl: './view-all-subjects.component.html',
    // styles: [':host { width: 100% }', require('./import-students.component.less')],
    styleUrls: ['./view-all-subjects.component.less']
})

export class ViewAllSubjectsCardComponent {

    alive: boolean;

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
        this.alive = true;
    }

    ngOnDestroy(): void {
        this.alive = false;
    }
}