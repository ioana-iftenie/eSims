import { Injectable }                               from '@angular/core';
import { Observable }                               from 'rxjs/Observable';
import { Router }                                   from '@angular/router';
import { Http, Response, Headers, RequestOptions }  from '@angular/http';
import { HttpClient, HttpHeaders }                  from '@angular/common/http';

import { ErrorHandlerService }                      from '../../core/services/error-handler.service';
import { TokenInteractionService }                  from '../../core/services/token-interaction.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/defer';
import 'rxjs/add/operator/shareReplay';

@Injectable()
export class StudentService {
	constructor(private router: Router, private http: HttpClient,
        private errorHandler: ErrorHandlerService, private token: TokenInteractionService) {}
    
    getStudentInfo(studentId: any): Observable<any> {
        let url = '/students/get-student-info/' + studentId;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError);
    }

    getCurrentStudyYears(studentId: any): Observable<any> {
        let url = '/students/get-current-stusy-years/' + studentId;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError);
    }

    getOptionalSubjects(studyYearIdS1: any, studyYearIdS2: any, studyYear: any, rank: any, specialize: any): Observable<any> {
        let url = '/students/get-optional-subjects/' + studyYearIdS1 + '/' + studyYearIdS2 + '/' + studyYear + '/' + rank + '/' + specialize;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError);
    }

    addOptionalSubjects(array: any[]): Observable<any> {
        let url = '/students/add-optional-subjects';

        let data = {
            subjects: array
        }

        return this.http.post(url, data)
        .catch(this.errorHandler.handleError);
    }

}