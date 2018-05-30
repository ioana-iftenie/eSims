import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { AdminService } from '../../../services/admin.services';
import { takeWhile } from 'rxjs/operator/takeWhile';

import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs/Subject';


@Component({
    selector: 'student-subject',
    templateUrl: './student-subject.component.html',
    styleUrls: ['./student-subject.component.less'],
    providers: [AdminService]
})

export class AdminStudentSubjectComponent {

    alive: boolean;
    semestersArray: any[];
    ranksArray: any[];
    studyYearsArray: any[];
    universityYearsArray: any[];
    specializesArray: any[];

    studentSubjectForm: FormGroup;

    studyYearId: any = null;
    studentsArray: any[];

    successMessage: string = null;
    errorMessage: string = null;

    displayStudents: boolean = false;

    steps: any = [0, 0, 0, 0, 0, 0, 0];
    uniqueCategories: any[] = [];

    constructor(private http: HttpClient, private adminService: AdminService, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.alive = true;
        this.semestersArray = [];
        this.ranksArray = [];
        this.studyYearsArray = [];
        this.universityYearsArray = [];
        this.specializesArray = [];
        this.createForm();

        this.adminService.getStudyYears()
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                response.forEach(element => {
                    if (this.semestersArray.indexOf(element.semester) === -1) this.semestersArray.push(element.semester);
                    if (this.ranksArray.indexOf(element.rank) === -1) this.ranksArray.push(element.rank);
                    if (this.studyYearsArray.indexOf(element.study_year) === -1) this.studyYearsArray.push(element.study_year);
                    if (this.universityYearsArray.indexOf(element.university_year) === -1) this.universityYearsArray.push(element.university_year);
                    if (this.specializesArray.indexOf(element.name) === -1) this.specializesArray.push(element.name);
                });

                this.studentSubjectForm.get('semester').setValue(this.semestersArray[0]);
                this.studentSubjectForm.get('studyYear').setValue(this.studyYearsArray[0]);
                this.studentSubjectForm.get('rank').setValue(this.ranksArray[0]);
                this.studentSubjectForm.get('universityYear').setValue(this.universityYearsArray[0]);
                this.studentSubjectForm.get('specialize').setValue(this.specializesArray[0]);

            },
            error => {
                console.log(error);
            }
        )
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    createForm() {
        const studentSubjectFormGroup = {};
        studentSubjectFormGroup['semester'] = []
        studentSubjectFormGroup['studyYear'] = [];
        studentSubjectFormGroup['rank'] = [];
        studentSubjectFormGroup['specialize'] = [];
        studentSubjectFormGroup['universityYear'] = [];

        this.studentSubjectForm = this.fb.group(studentSubjectFormGroup);

    }

    getStudyYearId(): void {
        let temp = {
            name: this.studentSubjectForm.value['specialize'],
            studyYear: this.studentSubjectForm.value['studyYear'],
            rank: this.studentSubjectForm.value['rank'],
            universityYear: this.studentSubjectForm.value['universityYear'],
            semester: this.studentSubjectForm.value['semester']
        };

        this.adminService.getStudyYearId(temp)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                this.studyYearId = response[0].ID;

                this.studentSubjectForm.get('semester').disable();
                this.studentSubjectForm.get('studyYear').disable();
                this.studentSubjectForm.get('rank').disable();
                this.studentSubjectForm.get('universityYear').disable();
                this.studentSubjectForm.get('specialize').disable();

                this.steps[0] = 1;
            }, error => {
                console.log(error);
            }
        )
    }

    getStudents(): void {
        this.adminService.getStudentsByStudyYearId(this.studyYearId)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                this.displayStudents = true;
                this.studentsArray = [];
                this.studentsArray = response;

                this.steps[0] = 0;
                this.steps[1] = 1;
            },
            error => {
                console.log(error);
            }
        )
    }

    getStudyPlanSubjects(): void {
        this.adminService.getMandatorySubjectsFromStudyPlan(this.studyYearId)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                this.studentsArray.forEach(element => {
                    element.subjects = [];
                    element.subjects = response.map(x => Object.assign({}, x));
                    
                    this.steps[1] = 0;
                    this.steps[2] = 1;
                });
            },
            error => {
                console.log(error);
            }
        )
    }

    getOptionalSubjects(): void {

        this.adminService.getOptionalSubjects(this.studyYearId)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {

                if (response.errorCode == 0 && response.statusCode == 1) {
                    this.successMessage = response.message;
                }

                if (response.errorCode == 0 && response.statusCode == 0) {
                    response.optionalSubjects.forEach(optional => {
                        if (this.uniqueCategories.indexOf(optional.optional_group) === -1) {
                            this.uniqueCategories.push(optional.optional_group);
                        }
                    });
                   
                    this.studentsArray.forEach(element => {
                        let hasOptionals = this.findStudent(response.selectedOptionals, element.id);

                        if (hasOptionals == false) {
                            this.uniqueCategories.forEach(category => {
                                let randomSubject = this.findRandomOptional(response.optionalSubjects, category);
                                element.subjects.push(randomSubject);
                            })
                        } else {
                            
                            response.selectedOptionals.forEach(selectedOp => {
                                if (element.id == selectedOp.student_id) {

                                    this.uniqueCategories.forEach(category => {
                                        if (selectedOp.optional_group == category) {
                                            let data = {
                                                id: selectedOp.subject_id,
                                                name: selectedOp.subject_name,
                                                optionalGroup: selectedOp.optional_group,
                                            }
                                            element.subjects.push(data);
                                            return;
                                        }
                                    })
                                }
                            })
                        }
                    })
                }

                this.steps[2] = 0;
                this.steps[3] = 1;
            },
            error => {
                console.log(error);
            }
        )
    }

    getUnpromotedSubjects() {
        let studyYearReinmatriculat = '0';
        let studyYearLastYear = '0';

        let tempReinmatriculat = {
            name: this.studentSubjectForm.value['specialize'],
            studyYear: this.studentSubjectForm.value['studyYear'],
            rank: this.studentSubjectForm.value['rank'],
            universityYear: this.studentSubjectForm.value['universityYear'],
            semester: this.studentSubjectForm.value['semester']
        };

        let uv = tempReinmatriculat.universityYear.split(' - ');
        tempReinmatriculat.universityYear = (parseInt(uv[0]) - 1) + ' - ' + (parseInt(uv[1]) - 1);

        //get studyYearId for reinmatriculati;
        this.adminService.getStudyYearId(tempReinmatriculat)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                if (response.length > 0)
                    studyYearReinmatriculat = response[0].ID;
                //get studyYearId for previous year;
                if (tempReinmatriculat.studyYear == 1) {
                    this.getUnpromotedSubjectsCall(studyYearReinmatriculat, studyYearLastYear);
                } else {
                    let tempLastYear = {
                        name: this.studentSubjectForm.value['specialize'],
                        studyYear: this.studentSubjectForm.value['studyYear'],
                        rank: this.studentSubjectForm.value['rank'],
                        universityYear: this.studentSubjectForm.value['universityYear'],
                        semester: this.studentSubjectForm.value['semester']
                    };
                    tempLastYear.studyYear = parseInt(tempLastYear.studyYear) - 1;
                    let uv = tempLastYear.universityYear.split(' - ');
                    tempLastYear.universityYear = (parseInt(uv[0]) - 1) + ' - ' + (parseInt(uv[1]) - 1);

                    this.adminService.getStudyYearId(tempLastYear)
                    .takeWhile(() => this.alive)
                    .subscribe(
                        response => {
                            if (response.length > 0)
                                studyYearLastYear = response[0].ID;

                            this.getUnpromotedSubjectsCall(studyYearReinmatriculat, studyYearLastYear);
                        },
                        error => {
                            console.log(error);
                        }
                    )
                }

                this.steps[3] = 0;
                this.steps[4] = 1;

            },
            error => {
                console.log(error);
            }
        )
    }

    equateSubjects() {
        let studyYearReinmatriculat = '0';
        let studyYearLastYear = '0';

        let tempReinmatriculat = {
            name: this.studentSubjectForm.value['specialize'],
            studyYear: this.studentSubjectForm.value['studyYear'],
            rank: this.studentSubjectForm.value['rank'],
            universityYear: this.studentSubjectForm.value['universityYear'],
            semester: this.studentSubjectForm.value['semester']
        };

        let uv = tempReinmatriculat.universityYear.split(' - ');
        tempReinmatriculat.universityYear = (parseInt(uv[0]) - 1) + ' - ' + (parseInt(uv[1]) - 1);

        //get studyYearId for reinmatriculati;
        this.adminService.getStudyYearId(tempReinmatriculat)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                if (response.length > 0)
                    studyYearReinmatriculat = response[0].ID;
                //get studyYearId for previous year;
                if (tempReinmatriculat.studyYear == 1) {
                    this.equateSubjectsCall(studyYearReinmatriculat, studyYearLastYear);
                } else {
                    let tempLastYear = {
                        name: this.studentSubjectForm.value['specialize'],
                        studyYear: this.studentSubjectForm.value['studyYear'],
                        rank: this.studentSubjectForm.value['rank'],
                        universityYear: this.studentSubjectForm.value['universityYear'],
                        semester: this.studentSubjectForm.value['semester']
                    };
                    tempLastYear.studyYear = parseInt(tempLastYear.studyYear) - 1;
                    let uv = tempLastYear.universityYear.split(' - ');
                    tempLastYear.universityYear = (parseInt(uv[0]) - 1) + ' - ' + (parseInt(uv[1]) - 1);

                    this.adminService.getStudyYearId(tempLastYear)
                    .takeWhile(() => this.alive)
                    .subscribe(
                        response => {
                            if (response.length > 0)
                                studyYearLastYear = response[0].ID;
                            this.equateSubjectsCall(studyYearReinmatriculat, studyYearLastYear);
                        },
                        error => {
                            console.log(error);
                        }
                    )
                }
                this.steps[4] = 0;
                this.steps[5] = 1;
            },
            error => {

            }
        )
    }

    addSubjects() {
        this.adminService.addStudentsSubjects(this.studentsArray, this.studyYearId)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                console.log(response);
                if (response.errorCode == 0) {
                    this.steps[5] = 0;
                    this.steps[6] = 1;
                    this.successMessage = response.message;
                }
            },
            error => {
                console.log(error);
            }
        )
    }

    findStudent(array, id) {
        return array.some(element => {
            if (element.student_id == id) {
                return element;
            }
        });
    };

    findRandomOptional(array, category) {
        let temp = [];
        array.forEach(element => {
            if (element.optional_group == category) {
                let data = {
                    id: element.id,
                    name: element.name,
                    optionalGroup: element.optional_group
                }

                temp.push(data);
            }
        });

        var rand = Math.floor((Math.random() * temp.length));
        return temp[rand];
    }

    getUnpromotedSubjectsCall(studyYearReinmatriculat: any, studyYearLastYear: any) {
        this.adminService.getUnpromotedSubjects(studyYearReinmatriculat, studyYearLastYear)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                if (response.length == 0) {
                    this.successMessage = "No unpromoted subjects were found";
                }

                if (response.length > 0) {

                    this.studentsArray.forEach(element => {

                        response.forEach(unpromoted => {
                            if (unpromoted.studentId == element.id) {
                                let ok = 1;
                                element.subjects.forEach(subject => {
                                    if (subject.id == unpromoted.subjectId) {
                                        ok = 0;
                                        return;
                                    }
                                })
                                if (ok == 1) {
                                    let temp = {
                                        id: unpromoted.subjectId,
                                        name: unpromoted.subjectName,
                                        unpromoted: true
                                    }
                                    element.subjects.push(temp);
                                    return;
                                }
                            }
                        });
                    })
                }
                this.steps[3] = 0;
                this.steps[4] = 1;

            },
            error => {

            }
        )
    }

    equateSubjectsCall(studyYearReinmatriculat: any, studyYearLastYear: any) {
        this.adminService.equateSubjects(studyYearReinmatriculat, studyYearLastYear)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                if (response.length == 0) {
                    this.successMessage = "No subjects to equate";
                }

                if (response.length > 0) {
                    this.studentsArray.forEach(element => {
                        response.forEach(equate => {
                            if (element.id == equate.student_id) {
                                element.subjects.forEach(subject => {
                                    if (subject.id == equate.subject_id) {
                                        subject.grade = equate.final_grade;
                                    }
                                });
                            }
                        })
                    })
                }
            },
            error => {

            }
        )
    }
}