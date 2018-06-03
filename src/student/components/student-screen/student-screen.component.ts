import { Component, OnInit, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { User } from '../../../core/models/user.class';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AdminService } from '../../../admin/services/admin.services';


@Component({
    selector: 'student',
    templateUrl: './student-screen.component.html',
    styleUrls: ['./student-screen.component.less']
})

export class StudentScreenComponent {

    @Input()
    userInfo: User;

    alive: boolean = true;
    errorMessage: string = null;
    successMessage: string = null;

    student: any = null;

    studentForm: FormGroup;

    currentYear: any;
    lastYears: any;

    currentGroupModel: any[] = [];
    lastYearsGroupModel: any[] = [];
    currentIsBugetarModel: any[] = [];
    lastYearsIsBugetarModel: any[] = [];
    currentIsBursierModel: any[] = [];
    lastYearsIsBursierModel: any[] = [];
    currentIsExmatriculatModel: any[] = [];
    lastYearsIsExmatriculatModel: any[] = [];
    currentIsReinmatriculatModel: any[] = [];
    lastYearsIsReinmatriculatModel: any[] = [];
    currentIsRestantModel: any[] = [];
    lastYearsIsRestantModel: any[] = [];
    
    constructor(private http: HttpClient, private fb: FormBuilder, private adminService: AdminService) {
    }

    ngOnInit() {
        this.createForm();
        console.log("I am in here");

        this.adminService.getStudentInfo(localStorage.getItem('user_id'))
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                console.log(response);
                this.student = response.student[0];

                this.studentForm.get('id').setValue(localStorage.getItem('user_id'));
                this.studentForm.get('studentNumber').setValue(this.student.student_number);
                this.studentForm.get('firstName').setValue(this.student.first_name);
                this.studentForm.get('lastName').setValue(this.student.last_name);
                this.studentForm.get('motherName').setValue(this.student.mother_name);
                this.studentForm.get('fatherName').setValue(this.student.father_name);

                this.studentForm.get('dateOfBirth').setValue(this.student.date_of_birth.split('T')[0]);
                if (this.student.gender == 'F') {
                    this.studentForm.get('gender').setValue("Female");
                } else {
                    this.studentForm.get('gender').setValue("Male");
                }

                this.studentForm.get('email').setValue(this.student.email);
                this.studentForm.get('webmail').setValue(this.student.webmail);
                this.studentForm.get('phone').setValue(this.student.phone);
                this.studentForm.get('nationality').setValue(this.student.nationality);
                this.studentForm.get('citizenship').setValue(this.student.citizenship);
                this.studentForm.get('languageName').setValue(this.student.languageName);
                this.studentForm.get('signUpMark').setValue(this.student.sign_up_mark);

                this.currentYear = [];
                
                response.studentInfo.forEach(info => {
                      
                    let temp = {
                        studyYearId: info.study_year_id,
                        universityYear: info.university_year,
                        studyYear: info.study_year,
                        rank: info.rank,
                        specialize: info.name,
                        semester: info.semester,
                        subjects: [],
                        toPay: []
                    }
                    this.currentGroupModel.push(info.group_name);
                    this.currentIsBugetarModel.push(info.is_bugetar != null ? info.is_bugetar : false);
                    this.currentIsBursierModel.push(info.is_bursier);
                    this.currentIsExmatriculatModel.push(info.is_exmatriculat);
                    this.currentIsReinmatriculatModel.push(info.is_reinmatriculat);
                    this.currentIsRestantModel.push(info.is_restant);

                    response.studentSubjects.forEach(subject => {
                        if (subject.studyYearId == temp.studyYearId) {
                            let data = {
                                originalId: subject.originalId,
                                subjectId: subject.subjectId,
                                subjectName: subject.subjectName,
                                finalGrade: subject.finalGrade != null ? subject.finalGrade : ' - ',
                                grades: []
                            }

                            response.studentGrades.forEach(grade => {
                                if (grade.studyYearId == subject.studyYearId && subject.subjectId == grade.subjectId) {
                                    let smallGrade = {
                                        grade: grade.grade,
                                        gradeType: grade.markType
                                    };

                                    data.grades.push(smallGrade);
                                }
                            })

                            temp.subjects.push(data);
                        }
                    });
                    response.studentToPay.forEach(pay => {
                        if (temp.studyYearId == pay.study_year_id) {
                            let payTemp = {
                                id: pay.id,
                                name: pay.name,
                                amount: pay.amount,
                                isPayed: pay.is_payed,
                                payUntill: pay.pay_untill,
                                createdDate: pay.created_date
                            }
                            temp.toPay.push(payTemp);
                        }
                    })

                    this.currentYear.push(temp);

                });

                this.lastYears = [];
                response.studentInfoAudit.forEach(info => {
                      
                    let temp = {
                        studyYearId: info.study_year_id,
                        universityYear: info.university_year,
                        studyYear: info.study_year,
                        rank: info.rank,
                        specialize: info.name,
                        semester: info.semester,
                        subjects: [],
                        toPay: []
                    }

                    this.lastYearsGroupModel.push(info.group_name);
                    this.lastYearsIsBugetarModel.push(info.is_bugetar != null ? info.is_bugetar : false);
                    this.lastYearsIsBursierModel.push(info.is_bursier);
                    this.lastYearsIsExmatriculatModel.push(info.is_exmatriculat);
                    this.lastYearsIsReinmatriculatModel.push(info.is_reinmatriculat);
                    this.lastYearsIsRestantModel.push(info.is_restant);

                    response.studentSubjects.forEach(subject => {
                        if (subject.studyYearId == temp.studyYearId) {
                            let data = {
                                subjectId: subject.subjectId,
                                originalId: subject.originalId,
                                subjectName: subject.subjectName,
                                finalGrade: subject.finalGrade != null ? subject.finalGrade : ' - ',
                                grades: []
                            }

                            response.studentGrades.forEach(grade => {
                                if (grade.studyYearId == subject.studyYearId && subject.subjectId == grade.subjectId) {
                                    let smallGrade = {
                                        grade: grade.grade,
                                        gradeType: grade.markType,
                                        subjectId: grade.subjectId
                                    };

                                    data.grades.push(smallGrade);
                                }
                            })

                            temp.subjects.push(data);
                        }
                    });

                    response.studentToPay.forEach(pay => {
                        if (temp.studyYearId == pay.study_year_id) {
                            let payTemp = {
                                id: pay.id,
                                name: pay.name,
                                amount: pay.amount,
                                isPayed: pay.is_payed,
                                payUntill: pay.pay_untill,
                                createdDate: pay.created_date
                            }
                            temp.toPay.push(payTemp);
                        }
                    })

                    this.lastYears.push(temp);

                });
                
                console.log(this.currentYear);
                console.log(this.lastYears);

            },
            error => {
                console.log(error);
            }
        )
    }

    createForm() {
        
        const studentFormGroup = {};

        studentFormGroup['id'] = [];
        studentFormGroup['studentNumber'] = [];
        studentFormGroup['firstName'] = [];
        studentFormGroup['lastName'] = [];
        studentFormGroup['motherName'] = [];
        studentFormGroup['fatherName'] = [];
        studentFormGroup['dateOfBirth'] = [];
        studentFormGroup['gender'] = [];
        studentFormGroup['email'] = [];
        studentFormGroup['webmail'] = [];
        studentFormGroup['phone'] = [];
        studentFormGroup['nationality'] = [];
        studentFormGroup['citizenship'] = [];        
        studentFormGroup['languageName'] = [];
        studentFormGroup['signUpMark'] = [];

        this.studentForm = this.fb.group(studentFormGroup);
    }
}