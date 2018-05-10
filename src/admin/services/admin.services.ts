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
export class AdminService {
	constructor(private router: Router, private http: HttpClient,
        private errorHandler: ErrorHandlerService, private token: TokenInteractionService) {}
    
    importStudents(file: File, fileName: string): Observable<any> {
        let url = '/admins/students/import-students';

        const formData: FormData = new FormData();
        formData.append('importStudentsFile', file, fileName);

        return this.http.post(url, formData, { })
        .catch(this.errorHandler.handleError);

    }

    generateGroups(groupsA: any, groupsB: any, generalInfo: any): Observable<any> {
        let url='/admins/students/generate-groups';

        let data = {
            groupsA: groupsA,
            groupsB: groupsB,
            generalInfo: generalInfo
        };
        
        return this.http.post(url, data)
        .catch(this.errorHandler.handleError)
    }

    createSubject(subject: any): Observable<any> {
        let url='/admins/subjects/create';
        
        return this.http.post(url, subject)
        .catch(this.errorHandler.handleError)
    }

    searchSubjects(searchString: string, allActive): Observable<any> {
        let url = '/admins/subjects/search/' + searchString + '/' + allActive;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError);
    }

    getSubject(subjectId: number): Observable<any> {
        let url = '/admins/subjects/get-subject-info/' + subjectId;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError);
    }

    updateSubject(subject: any): Observable<any> {
        let url = '/admins/subjects/update';

        return this.http.post(url, subject)
        .catch(this.errorHandler.handleError)
    }

    getAllSubjects(): Observable<any> {
        let url = '/admins/subjects/view-all-subjects';

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError)
    }

    getStudyYears(): Observable<any> {
        let url = '/admins/subjects/get-study-plan';

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError);
    } 

    getStudyYearId(data: any): Observable<any> {
        let url = '/admins/subjects/get-study-year';

        return this.http.post(url, data)
        .catch(this.errorHandler.handleError)
    }

    searchSubjectsByStudyYear(data: any): Observable<any> {
        let url = '/admins/subjects/serchSubjectByStudyPlan/' + data.searchString + '/' + data.semester + '/' + data.rank + '/' + data.studyYear + '/' + data.specialize;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError);
    }

    createStudyPlan(studyPlan:any[]): Observable<any> {
        let url ='/admins/subjects/create-study-plan';
        let data = {
            data: studyPlan
        }
        return this.http.post(url, data)
        .catch(this.errorHandler.handleError);
    }
}