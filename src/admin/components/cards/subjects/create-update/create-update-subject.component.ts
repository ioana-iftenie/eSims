import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';

@Component({
    selector: 'create-update-subject-card',
    templateUrl: './create-update-subject.component.html',
    // styles: [':host { width: 100% }', require('./import-students.component.less')],
    styleUrls: ['./create-update-subject.component.less']
})

export class CreateUpdateSubjectCardComponent {

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