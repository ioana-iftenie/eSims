// tslint:disable:indent

import { Injectable }	from '@angular/core';
import { Subject } 		from 'rxjs/Subject';
import { LoaderState }	from '../models/loader.class';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { TokenInteractionService } from './token-interaction.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HomepageService {
	constructor(private router: Router, private http: HttpClient,
        private errorHandler: ErrorHandlerService, private token: TokenInteractionService) {}
    
    getHomepageInfo(data: any): Observable<any> {
        let url = `/auth/get-user-info/${data.outerId}/${data.isAdmin}/${data.isStudent}/${data.isProfessor}`;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError);

    }

}
