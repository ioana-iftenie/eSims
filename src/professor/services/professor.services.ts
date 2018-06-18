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
export class ProfessorService {
	constructor(private router: Router, private http: HttpClient,
        private errorHandler: ErrorHandlerService, private token: TokenInteractionService) {}
    
    getStudentFullSubjects(studyYearId: any, subjectId: any): Observable<any> {
        let url = '/professors/students/get-full-subjects/' + studyYearId + '/' + subjectId;

        return this.http.get(url)
        .catch(this.errorHandler.handleError);
    }

    getSubjectsList(studyYear: any, rank: any, semester: any, specialize: any): Observable<any> {
        let url = '/professors/get-subject-list/' + studyYear + '/' + rank + '/' + semester + '/' + specialize;

        return this.http.get(url)
        .catch(this.errorHandler.handleError);
    }

    getMarkTypes(): Observable<any> {
        let url = '/professors/get-mark-types';

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError);
    }

    addGrade(data: any): Observable<any> {
        let url = '/professors/add-grade';

        return this.http.post(url, data)
        .catch(this.errorHandler.handleError);
    }

    getProfInfo(professorId): Observable<any> {
        let url = '/professors/get-professor-info/' + professorId;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError);
    }

}