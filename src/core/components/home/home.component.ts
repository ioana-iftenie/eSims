import { Component, OnInit } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { Router }            from '@angular/router';

import { TokenInteractionService }  from '../../../core/services/token-interaction.service';
import { HomepageService }          from '../../services/homepage.service';

import                              'rxjs/add/operator/takeWhile';
import { User }                     from '../../models/user.class';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less'],
    providers: [HomepageService]
})

export class HomeScreenComponent {
    isAdmin    : boolean;
    isStudent  : boolean;
    isProfessor: boolean;

    alive: boolean;

    userInfo: User;
    selectedMenu: any = 1;
    
    constructor(private http: HttpClient, private token: TokenInteractionService, private router: Router,
                private homepageService: HomepageService) {}

    ngOnInit() {
        this.alive = true;

        let verifyUserData = {
            outerId: localStorage.getItem('user_id'),
            isAdmin: localStorage.getItem('is_admin'),
            isStudent: localStorage.getItem('is_student'),
            isProfessor: localStorage.getItem('is_professor')
        };

        // this.homepageService.getHomepageInfo(verifyUserData)
        // .takeWhile(() => this.alive)
        // .subscribe(
        //     response => {          
        //         this.userInfo = new User();
        //         this.userInfo.firstName = response.first_name;
        //         this.userInfo.lastName = response.last_name;

        //         localStorage.setItem('firstName', response.first_name);
        //         localStorage.setItem('lastName', response.last_name);

                this.isAdmin = this.token.isAdmin();
                this.isStudent = this.token.isStudent();
                this.isProfessor = this.token.isProfessor();
        //     },
        //     error => {
        //         console.log(error)
        //     }
        // );
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    getMenuSelected(event) {
        console.log(event)
        this.selectedMenu = event;
    }
}