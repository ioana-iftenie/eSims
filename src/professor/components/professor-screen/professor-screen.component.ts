import { Component, OnInit, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { User } from '../../../core/models/user.class';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdminService } from '../../../admin/services/admin.services';
import { ProfessorService } from '../../services/professor.services';
import { TokenInteractionService } from '../../../core/services/token-interaction.service';

@Component({
    selector: 'professor',
    templateUrl: './professor-screen.component.html',
    styleUrls: ['./professor-screen.component.less'],
    providers: [AdminService, ProfessorService]
})

export class ProfessorScreenComponent {

    studyPlanForm: FormGroup;
    alive: boolean;
    semestersArray: any[];
    ranksArray: any[];
    studyYearsArray: any[];
    universityYearsArray: any[];
    specializesArray: any[];
    subjectsArray: any[];
    markTypesArray: any[] = [];

    studyYearId: any;

    studentsArray: any[];
    displayStudents: boolean = false;
    displaySubjectsDr: boolean = false;
    groupModel: string;
    subjectModel: string = 'none';
    groups: any[];

    showModal: boolean = false;
    modalStudent: any;
    markType: any;
    gradeModel: any;

    professorName: string;

    constructor(private http: HttpClient, private fb: FormBuilder, private adminService: AdminService, 
                private professorService: ProfessorService, private token: TokenInteractionService) {
    }

    ngOnInit() {
        this.alive = true;
        this.semestersArray = [];
        this.ranksArray = [];
        this.studyYearsArray = [];
        this.universityYearsArray = [];
        this.specializesArray = [];
        this.createForm();

        this.professorService.getProfInfo(localStorage.getItem('user_id'))
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                this.professorName = response[0].professorName;
            },
            error => {

            }
        )

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

                this.studyPlanForm.get('semester').setValue(this.semestersArray[0]);
                this.studyPlanForm.get('studyYear').setValue(this.studyYearsArray[0]);
                this.studyPlanForm.get('rank').setValue(this.ranksArray[0]);
                this.studyPlanForm.get('universityYear').setValue(this.universityYearsArray[0]);
                this.studyPlanForm.get('specialize').setValue(this.specializesArray[0]);

            },
            error => {
                console.log(error);
            }
        )
    }
    
    createForm() {
        const studyPlanFormGroup = {};
        studyPlanFormGroup['semester'] = []
        studyPlanFormGroup['studyYear'] = [];
        studyPlanFormGroup['rank'] = [];
        studyPlanFormGroup['specialize'] = [];
        studyPlanFormGroup['universityYear'] = [];

        this.studyPlanForm = this.fb.group(studyPlanFormGroup);

    }

    getStudyYear() {
        let temp = {
            name: this.studyPlanForm.value['specialize'],
            studyYear: this.studyPlanForm.value['studyYear'],
            rank: this.studyPlanForm.value['rank'],
            universityYear: this.studyPlanForm.value['universityYear'],
            semester: this.studyPlanForm.value['semester']
        };

        this.adminService.getStudyYearId(temp)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                this.studyYearId = response[0].ID;

                this.studyPlanForm.get('semester').disable();
                this.studyPlanForm.get('studyYear').disable();
                this.studyPlanForm.get('rank').disable();
                this.studyPlanForm.get('universityYear').disable();
                this.studyPlanForm.get('specialize').disable();

                this.getSubjects();

            }, error => {
                console.log(error);
            }
        )

    }

    getSubjects() {
        console.log("here")
        let temp = {
            name: this.studyPlanForm.value['specialize'],
            studyYear: this.studyPlanForm.value['studyYear'],
            rank: this.studyPlanForm.value['rank'],
            universityYear: this.studyPlanForm.value['universityYear'],
            semester: this.studyPlanForm.value['semester']
        };

        this.professorService.getSubjectsList(temp.studyYear, temp.rank, temp.semester, temp.name)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                this.subjectsArray = response.map(x => Object.assign({}, x));
                this.displaySubjectsDr = true;
            },
            error => {

            }
        )
    }

    getSubjectsForRestantStudents() {

    }

    getStudents() {
        this.adminService.getStudentsAssignedToSubject(this.subjectModel, this.studyYearId)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                this.studentsArray = [];
                this.studentsArray = response.map(x => Object.assign({}, x));

                this.displayStudents = true;
                this.groups = [];
                this.groupModel = '0';

                this.studentsArray.forEach(student => {
                    if (this.groups.indexOf(student.groupName) === -1) {
                        this.groups.push(student.groupName);
                    }
                })

                if (this.subjectModel != 'none') {

                    this.professorService.getStudentFullSubjects(this.studyYearId, this.subjectModel)
                    .takeWhile(() => this.alive)
                    .subscribe(
                        response => {

                            this.studentsArray.forEach(student => {
                                response.forEach(resp => {
                                    if (student.id == resp.studentId) {
                                        
                                        if (student.grades == undefined) {
                                            student.grades = [];
                                        }
                                        let temp = {
                                            markTypeName: resp.markTypeName,
                                            grade: resp.grade
                                        }

                                        student.grades.push(temp);

                                    }
                                });
                            })
                        },
                        error => {

                        }
                    )
                }

            },
            error => {
                console.log(error);
            }
        )
    }

    addMark(index) {
        this.showModal = true;
        let i = 0;
        for (i = 0; i<this.studentsArray.length; i++) {
            if (this.studentsArray[i].id == index) {
                this.modalStudent = this.studentsArray[i];
                break;
            }
        }

        if (this.markTypesArray.length == 0) {
            this.professorService.getMarkTypes()
            .takeWhile(() => this.alive)
            .subscribe(
                response => {
                    this.markTypesArray = response.map(x => Object.assign({}, x));

                    this.markType = this.markTypesArray[0].id;
                },
                error => {

                }
            )
        }
        
    }

    addGrades() {
        if (this.modalStudent != null) {
            if (this.modalStudent.grades == undefined) {
                this.modalStudent.grades = [];
            }
            let markTypeName = null;

            this.markTypesArray.forEach(markType => {
                if (markType.id == this.markType) {
                    markTypeName = markType.name;
                    return;
                }

            })
            let temp = {
                markTypeId: this.markType,
                markTypeName:markTypeName,
                grade: this.gradeModel,
                isNew: true
            }
            
            this.modalStudent.grades.push(temp);

            let data = {
                student_id: this.modalStudent.id,
                study_year_id: this.studyYearId,
                subject_id: this.subjectModel,
                grade: this.gradeModel,
                grade_type: this.markType
            }
            this.professorService.addGrade(data)
            .takeWhile(() => this.alive)
            .subscribe(
                response => {
                   
                },
                error => {

                }
            )
        }

        this.closeModal();
    }

    closeModal() {
        this.showModal = false;
        this.modalStudent = null;
    }

    logout(): void {
		this.token.clear();
    }
}