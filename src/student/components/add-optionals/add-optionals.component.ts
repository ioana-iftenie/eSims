import { Component, OnInit, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { User } from '../../../core/models/user.class';
import { AdminService } from '../../../admin/services/admin.services';
import { StudentService } from '../../services/student.services';
import { TokenInteractionService } from '../../../core/services/token-interaction.service';

@Component({
    selector: 'add-optionals',
    templateUrl: './add-optionals.component.html',
    styleUrls: ['./add-optionals.component.less']
})

export class AddOptionalsComponent {
    
    alive: boolean = true;

    @Input()
    selectedMenuItem: any;
    nextStudyYearS1: any;
    nextStudyYearS2: any;

    successMessage: string;
    errorMessage: string;

    studyYearInfo: any;

    subjects: any[] = [];
    otherSubjects: any[] = [];

    selectedSubject: any[] = [];

    alreadySelectedSubjects: any[] = [];

    constructor(private http: HttpClient, private studentService: StudentService, private adminService: AdminService,
                private token: TokenInteractionService) {
    }

    ngOnInit() {
        this.alive = true;

        this.studentService.getCurrentStudyYears(localStorage.getItem('user_id'))
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                
                this.studyYearInfo = response;

                let temp = {
                    name: response[0].NAME,
                    studyYear: parseInt(response[0].STUDY_YEAR) + 1,
                    rank: response[0].RANK,
                    universityYear: response[0].UNIVERSITY_YEAR,
                    semester: response[0].SEMESTER
                };

                let uv = temp.universityYear.split(' - ');
                temp.universityYear = (parseInt(uv[0]) + 1) + ' - ' + (parseInt(uv[1]) + 1);
        
                if (temp.rank == 'B' && temp.studyYear == 4 || temp.rank == 'M' && temp.studyYear == 3) {
                    this.successMessage = 'You are on the final year. No subjects for you to select.'
                } else {

                    this.adminService.getStudyYearId(temp)
                    .takeWhile(() => this.alive)
                    .subscribe(
                        response => {
                            this.nextStudyYearS1 = response[0].ID;
                            let temp = {
                                name: this.studyYearInfo[1].NAME,
                                studyYear: parseInt(this.studyYearInfo[1].STUDY_YEAR) + 1,
                                rank: this.studyYearInfo[1].RANK,
                                universityYear: this.studyYearInfo[1].UNIVERSITY_YEAR,
                                semester: this.studyYearInfo[1].SEMESTER
                            };
                    
                            let uv = temp.universityYear.split(' - ');
                            temp.universityYear = (parseInt(uv[0]) + 1) + ' - ' + (parseInt(uv[1]) + 1);
                    
                            this.adminService.getStudyYearId(temp)
                            .takeWhile(() => this.alive)
                            .subscribe(
                                response => {
                                    this.nextStudyYearS2 = response[0].ID;

                                    this.studentService.getOptionalSubjects(this.nextStudyYearS1, this.nextStudyYearS2, parseInt(this.studyYearInfo[0].STUDY_YEAR) + 1, this.studyYearInfo[0].RANK, this.studyYearInfo[0].NAME)
                                    .takeWhile(() => this.alive)
                                    .subscribe(
                                        response => {
                                            if (response.errorCode == 1) {
                                                this.errorMessage = response.message;

                                                this.studentService.getSelectedOptionalSubjects(this.nextStudyYearS1, this.nextStudyYearS2, parseInt(localStorage.getItem('user_id')))
                                                .takeWhile(() => this.alive)
                                                .subscribe(
                                                    response => {
                                                        console.log(response);
                                                        
                                                        response.forEach(selectedSubject => {
                                                            let temp = {
                                                                subjectName: selectedSubject.name,
                                                                studyYear: selectedSubject.study_year,
                                                                semester: selectedSubject.semester,
                                                                optionalGroup: selectedSubject.optional_group
                                                            }
                                                            this.alreadySelectedSubjects.push(temp);
                                                        });
                                                    },
                                                    error => {

                                                    }
                                                )
                                            } else {
                                                response.forEach(subject => {
                                                    if (subject.is_mandatory == 1){
                                                        let ok  = 1;
                                                        this.subjects.forEach(sj => {
                                                            if (sj.subjectCode == subject.optional_group) {
                                                                ok = 0;
                                                                let temp = {
                                                                    id: subject.subject_id,
                                                                    name: subject.name
                                                                }
                                                                sj.subjects.push(temp);
                                                            }
                                                        })
                                                        if (ok == 1) {
                                                            let data = {
                                                                subjectCode: subject.optional_group,
                                                                studyYear: subject.study_year,
                                                                semester: subject.semester,
                                                                studyYearId: subject.semester == 1 ? this.nextStudyYearS1 : this.nextStudyYearS2,
                                                                subjects: []
                                                            };
                                                            this.subjects.push(data);

                                                            this.subjects.forEach(sj => {
                                                                if (sj.subjectCode == subject.optional_group) {
                                                                    ok = 0;
                                                                    let temp = {
                                                                        id: subject.subject_id,
                                                                        name: subject.name
                                                                    }
                                                                    sj.subjects.push(temp);
                                                                }
                                                            })
                                                        }

                                                    } else {
                                                        let nonMandatory = {
                                                            semester: subject.semester,
                                                            id: subject.subject_id,
                                                            name: subject.name
                                                        }
                                                        this.otherSubjects.push();
                                                    }
                                                });

                                                this.subjects.forEach(subject => {
                                                    let data = [];
                                                    data.push(subject.subjectCode);
                                                    data.push(null);
                                                    data.push(parseInt(localStorage.getItem('user_id')));
                                                    data.push(subject.studyYearId);
                                                    
                                                    this.selectedSubject.push(data);
                                                })
                                            }
                                        },
                                        error => {

                                        }
                                    )
                                },
                                error => {

                                }
                            )
                        },
                        error => {

                        }
                    )
                }
            },
            error =>{

            }
        )
    }

    changeSubject(subjectCode: any, subjectId: any) {
        this.errorMessage = null;
        this.successMessage = null;

        this.selectedSubject.forEach(subject => {
            if (subject[0] == subjectCode)
                subject[1] = subjectId;
        })
    }

    saveSubjects() {
        let ok = 1;
        let array = [];

        this.selectedSubject.forEach(subject => {
            let temp = [];
            if (subject[1] == null) {
                this.errorMessage = 'Please select one subject from each category.';
                ok = 0;
                return;
            }
            temp.push(parseInt(subject[2]));
            temp.push(parseInt(subject[1]));
            temp.push(parseInt(subject[3]));

            array.push(temp);
        });
        console.log(array);
        if (ok == 1) {
            this.studentService.addOptionalSubjects(array)
            .takeWhile(() => this.alive)
            .subscribe(
                response => {
                    if (response.errorCode == 0) {
                        this.successMessage = response.message;
                        this.subjects = [];
                    }
                },
                error => {

                }
            )
        }
    }
}