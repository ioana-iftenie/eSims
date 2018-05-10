import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { AdminService } from '../../../services/admin.services';
import { takeWhile } from 'rxjs/operator/takeWhile';


@Component({
    selector: 'view-all-subjects',
    templateUrl: './view-all-subjects.component.html',
    // styles: [':host { width: 100% }', require('./import-students.component.less')],
    styleUrls: ['./view-all-subjects.component.less'],
    providers: [AdminService]
})

export class ViewAllSubjectsComponent {

    alive: boolean;
    bachelorArray: any[];
    mastersArray: any[];

    constructor(private http: HttpClient, private adminService: AdminService) {
    }

    ngOnInit() {
        this.alive = true;
        this.bachelorArray = [];
        this.mastersArray = [];

        this.adminService.getAllSubjects()
        .takeWhile(() => this.alive)
        .subscribe(
            response => {
                response.forEach(subject => {
                    if (subject.rank == 'B') {

                            let temp = {
                                name: subject.name,
                                points: subject.points,
                                specialize: subject.specialize,
                                statusInd: subject.status_ind,
                                isMandatory: subject.is_mandatory,
                                subjectCategory: subject.optional_group,
                                studyYear: subject.study_year,
                                semester: subject.semester
                            }

                            this.bachelorArray.push(temp)

                    } else {
                        let temp = {
                            name: subject.name,
                            points: subject.points,
                            specialize: subject.specialize,
                            statusInd: subject.status_ind,
                            isMandatory: subject.is_mandatory,
                            subjectCategory: subject.optional_group,
                            studyYear: subject.study_year,
                            semester: subject.semester
                        }

                        this.mastersArray.push(temp)
                    }
                });
            },
            error => {
                console.log(error);
            }
        )
    }

    ngOnDestroy(): void {
        this.alive = false;
    }
}