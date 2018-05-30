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

    getSubjectsFromStudyPlan(studyPlanId: any): Observable<any> {
        let url = '/admins/subjects/get-subjects-from-study-plan/' + studyPlanId;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError)
    }

    getStudentsByStudyYearId(studyYearId: any): Observable<any> {
        let url = '/admins/subjects/get-students-for-study-year-id/' + studyYearId;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError)
    }

    getMandatorySubjectsFromStudyPlan(studyYearId: any): Observable<any> {
        let url = '/admins/subjects/get-mandatory-subjects-from-study-plan/' + studyYearId;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError)
    }

    getOptionalSubjects(studyYearId: any): Observable<any> {
        let url = '/admins/subjects/get-optional-subjects/' + studyYearId;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError);
    }

    getUnpromotedSubjects(studyYearIdRenumbered: any, studyYearIdLastYear): Observable<any> {
        let url = '/admins/subjects/get-unpromoted-subjects/' + studyYearIdRenumbered + '/' + studyYearIdLastYear;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError);
    }

    equateSubjects(studyYearIdRenumbered: any, studyYearIdLastYear): Observable<any> {
        let url = '/admins/subjects/equate-subjects/' + studyYearIdRenumbered + '/' + studyYearIdLastYear;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError);
    }

    addStudentsSubjects(studentSubjects: any[], studyYearId: any): Observable<any> {
        let url = '/admins/subjects/add-student-subjects';

        let data = {
            data: studentSubjects,
            studyYearId: studyYearId
        }

        return this.http.post(url, data)
        .catch(this.errorHandler.handleError);
    }

    getFianalStudentGrades(studyYearId: any): Observable<any> {
        let url = '/admins/students/get-pre-final-grades/' + studyYearId;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError);
    }

    addFinalStudentGrades(finalGradesArray): Observable<any> {
        let url = '/admins/students/add-final-grades';
        let data = {
            finalGrades: finalGradesArray
        }

        return this.http.post(url, data)
        .catch(this.errorHandler.handleError);
    }

    getStudyYearsIdWithoutSemester(data: any): Observable<any> {
        let url = '/admins/students/get-study-years-without-semester';

        return this.http.post(url, data)
        .catch(this.errorHandler.handleError)
    }

    getStudentsByStudyYearsId(studyYearS1: any, studyYearS2: any): Observable<any> {
        let url = '/admins/students/get-students-by-study-years/' + studyYearS1 + '/' + studyYearS2;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError)
    }

    getStudentsSubjectsForEntireYear(studyYearS1: any, studyYearS2: any): Observable<any> {
        let url = '/admins/students/get-students-subjects-full-year/' + studyYearS1 + '/' + studyYearS2;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError)
    }

    updateStudentsSituation(studyYearS1: any, studyYearS2: any, updatedStudentsArray, deleteFinalStudents, toPayArray, isFinalYear: boolean): Observable<any> {
        let url = '/admins/students/update-students-situation';

        let data = {
            studyYearIdS1: studyYearS1,
            studyYearIdS2: studyYearS2,
            updatedStudentsInfo: updatedStudentsArray,
            deleteFinalStudents: deleteFinalStudents,
            toPay: toPayArray,
            isFinalYear: isFinalYear
        }

        return this.http.post(url, data)
        .catch(this.errorHandler.handleError)
    }

    searchStudent(searchString: string): Observable<any> {
        let url = '/admins/students/search-student/' + searchString;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError)
    }

    getStudentInfo(studentId: string): Observable<any> {
        let url = '/admins/students/get-student-info/' + studentId;

        return this.http.get(url, {})
        .catch(this.errorHandler.handleError)
    }

    updateStudentInfo(studentId: string, newData: any): Observable<any> {
        let url = '/admins/students/update-student-info';
        
        let data = {
            studentId: studentId,
            studentInfo: newData
        };

        return this.http.post(url, data)
        .catch(this.errorHandler.handleError)
    }
}