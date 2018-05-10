import { Injectable }                               from '@angular/core';
import { Observable }                               from 'rxjs/Observable';
import { Router }                                   from '@angular/router';
import { HttpClient, HttpHeaders }                  from '@angular/common/http';

import { ErrorHandlerService }                      from '../../core/services/error-handler.service';
import { TokenInteractionService }                  from '../../core/services/token-interaction.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/defer';
import 'rxjs/add/operator/shareReplay';

@Injectable()
export class LoginService {
	constructor(private router: Router, private http: HttpClient,
        private errorHandler: ErrorHandlerService, private token: TokenInteractionService) {}
    
    login(username: any, password: any): Observable<any> {
        let url = '/auth/login';

        const headers = new HttpHeaders({
            'Authorization': 'Basic Y2FsbC1jZW50ZXI6c3VwcG9ydA==',
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.post(url, 'username=' + username + '&password=' + password + '&grant_type=password', {
            headers: headers
        })
        .catch(this.errorHandler.handleError);

    }
}