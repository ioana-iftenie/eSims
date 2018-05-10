import { Component, OnInit, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { Router }            from '@angular/router';

import { TokenInteractionService }  from '../../../core/services/token-interaction.service';

import                              'rxjs/add/operator/takeWhile';
import { User } from '../../../core/models/user.class';
import { SharedService } from '../../services/shared.service';


@Component({
    selector: 'admin-navigation',
    templateUrl: './admin-navigation.component.html',
    styleUrls: ['./admin-navigation.component.less'],
    providers: []
})

export class AdminNavigationComponent {
    alive: boolean;
    isAdmin: boolean;
    firstName: string;
    lastName: string;
    hideNavigation: boolean = false;

    
    @Input()
    userInfo: User;

    constructor(private http: HttpClient, private token: TokenInteractionService, private router: Router,
                private sharedServ: SharedService) {
        this.isAdmin = token.isAdmin();
    }

    ngOnInit() {
        this.alive = true;

        let verifyUserData = {
            outerId: localStorage.getItem('user_id'),
            isAdmin: localStorage.getItem('is_admin'),
            isStudent: localStorage.getItem('is_student'),
            isProfessor: localStorage.getItem('is_professor')
        };

        this.sharedServ.getUserInfo(verifyUserData)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {          
                this.userInfo = new User();
                this.userInfo.firstName = response.first_name;
                this.userInfo.lastName = response.last_name;
            },
            error => {
                console.log(error)
            }
        );
    }
}