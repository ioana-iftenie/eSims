import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';

@Component({
    selector: 'view-study-plan-card',
    templateUrl: './view-study-plan.component.html',
    // styles: [':host { width: 100% }', require('./import-students.component.less')],
    styleUrls: ['./view-study-plan.component.less']
})

export class ViewStudyPlanCardComponent {

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