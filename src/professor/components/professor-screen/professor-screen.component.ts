import { Component, OnInit, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { User } from '../../../core/models/user.class';

@Component({
    selector: 'professor',
    templateUrl: './professor-screen.component.html',
    styleUrls: ['./professor-screen.component.less']
})

export class ProfessorScreenComponent {

    @Input()
    userInfo: User;
    
    constructor(private http: HttpClient) {
    }
}