import { Component, OnInit, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { User } from '../../../core/models/user.class';
import { AdminService } from '../../../admin/services/admin.services';
import { StudentService } from '../../services/student.services';
import { TokenInteractionService } from '../../../core/services/token-interaction.service';

@Component({
    selector: 'student-navigation',
    templateUrl: './student-navigation.component.html',
    styleUrls: ['./student-navigation.component.less']
})

export class StudentNavigationComponent {
    
    alive: boolean;
    studentInfo: any;


    @Input()
    selectedMenuItem: any;

    constructor(private http: HttpClient, private studentService: StudentService, private adminService: AdminService,
                private token: TokenInteractionService) {
    }

    ngOnInit() {
        this.alive = true;

        this.studentService.getStudentInfo(localStorage.getItem('user_id'))
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                this.studentInfo = response[0];
            },
            error => {

            }
        )
    }

    logout(): void {
		this.token.clear();
    }
}