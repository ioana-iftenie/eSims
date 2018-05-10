// tslint:disable:indent

import { Injectable }	from '@angular/core';
import { Subject } 		from 'rxjs/Subject';
// import { LoaderState }	from '../models/loader.class';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { TokenInteractionService } from '../../core/services/token-interaction.service';

@Injectable()
export class SharedService {
	constructor(private router: Router, private http: HttpClient,
        private errorHandler: ErrorHandlerService, private token: TokenInteractionService) {}
    
    getUserInfo(data: any): Observable<any> {
        let url = `/auth/get-user-info/${data.outerId}/${data.isAdmin}/${data.isStudent}/${data.isProfessor}`;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError);

    }

}
