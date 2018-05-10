import { Component, OnInit } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { Router }            from '@angular/router';

import { LoginService }             from '../../services/login.services';
import { TokenInteractionService }  from '../../services/token-interaction.service';

import                              'rxjs/add/operator/takeWhile';


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    providers: [LoginService]
})

export class LoginComponent {
    alive:    boolean;
    username: string;
    password: string;
    errorMessage: string;

    constructor(private http: HttpClient, private loginService: LoginService, private token: TokenInteractionService, private router: Router) {
    }

    ngOnInit() {
        this.alive = true;
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    submitLogin(): void {
        this.errorMessage = '';

        console.log("Perfomred login request")

        this.loginService.login(this.username, this.password)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {          
                this.token.create(response);
                this.router.navigate(['home']);
            },
            error => {
                this.errorMessage = error;
                console.log(error)
            }
        );
    }
}