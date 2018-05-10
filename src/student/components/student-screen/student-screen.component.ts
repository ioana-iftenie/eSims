import { Component, OnInit, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { User } from '../../../core/models/user.class';

@Component({
    selector: 'student',
    templateUrl: './student-screen.component.html',
    styleUrls: ['./student-screen.component.less']
})

export class StudentScreenComponent {

    @Input()
    userInfo: User;
    
    constructor(private http: HttpClient) {
    }
}