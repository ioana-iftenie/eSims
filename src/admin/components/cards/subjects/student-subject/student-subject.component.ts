import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';

@Component({
    selector: 'student-subject-card',
    templateUrl: './student-subject.component.html',
    styleUrls: ['./student-subject.component.less']
})

export class AdminStudentSubjectCardComponent {

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