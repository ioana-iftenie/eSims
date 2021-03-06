import { BrowserModule }            from '@angular/platform-browser';
import { NgModule }                 from '@angular/core';
import { FormsModule, ReactiveFormsModule }              from '@angular/forms';
import { RouterModule }             from '@angular/router';
import { CommonModule }             from '@angular/common';

import { AdminScreenComponent }     from './components/admin-screen/admin-screen.component';
import { ImportStudentsComponent }  from './components/import-students/import-students.component';
import { TableComponent }           from './components/table/table.component';
import { GenerateGroupsCardComponent } from './components/cards/generate-groups-cards/generate-groups-card.component';
import { GenerateGroupsComponent } from './components/generate-groups/generate-groups.component';

import { AdminService }             from './services/admin.services';
import { SharedModule }             from '../shared/shared.module';

import { CreateUpdateSubjectCardComponent }   from './components/cards/subjects/create-update/create-update-subject.component';
import { ViewAllSubjectsCardComponent }       from './components/cards/subjects/view-all/view-all-subjects.component';
import { CreateUpdateSubjectComponent }       from './components/subjects/create-update/create-update-subject.component';
import { ViewAllSubjectsComponent }           from './components/subjects/view-all/view-all-subjects.component';

import { MyDatePickerModule }			from 'mydatepicker';
import { StudyPlanCardComponent } from './components/cards/subjects/study-plan/study-plan.component';
import { StudyPlanComponent } from './components/subjects/study-plan/study-plan.component';
import { ViewStudyPlanCardComponent } from './components/cards/subjects/view-study-plan/view-study-plan.component';
import { ViewStudyPlanComponent } from './components/subjects/view-study-plan/view-study-plan.component';
import { ViewStudentCardComponent } from './components/cards/view-student/view-student-card.component';
import { ViewStudentComponent } from './components/view-student/view-student.component';
import { AdminStudentSubjectCardComponent } from './components/cards/subjects/student-subject/student-subject.component';
import { AdminStudentSubjectComponent } from './components/subjects/student-subject/student-subject.component';
import { AddFinalGradesCardCardComponent } from './components/cards/add-final-grades/add-final-grades-card.component';
import { AddFinalGradesComponent } from './components/add-final-grades/add-final-grades.component';
import { UpdateStudentSituationCardCardComponent } from './components/cards/update-student-situation/update-student-situation-card.component';
import { UpdateStudentSituationComponent } from './components/update-student-situation/update-student-situation.component';


@NgModule({
  declarations: [
    AdminScreenComponent,
    ImportStudentsComponent,
    TableComponent,
    GenerateGroupsCardComponent, // Remove wen needed
    GenerateGroupsComponent, // Remove wen needed
    CreateUpdateSubjectCardComponent,
    ViewAllSubjectsCardComponent,
    ViewStudentCardComponent,
    StudyPlanCardComponent,
    ViewStudyPlanCardComponent,
    AdminStudentSubjectCardComponent,
    AddFinalGradesCardCardComponent,
    UpdateStudentSituationCardCardComponent,
    CreateUpdateSubjectComponent,
    ViewAllSubjectsComponent,
    StudyPlanComponent,
    ViewStudyPlanComponent,
    ViewStudentComponent,
    AdminStudentSubjectComponent,
    AddFinalGradesComponent,
    UpdateStudentSituationComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    MyDatePickerModule
  ],
  providers: [
    AdminService
  ],
  exports: [
    AdminScreenComponent,
    ImportStudentsComponent,
    TableComponent,
    GenerateGroupsCardComponent,
    GenerateGroupsComponent,
    CreateUpdateSubjectCardComponent,
    ViewAllSubjectsCardComponent,
    ViewStudentCardComponent,
    StudyPlanCardComponent,
    ViewStudyPlanCardComponent,
    AdminStudentSubjectCardComponent,
    AddFinalGradesCardCardComponent,
    UpdateStudentSituationCardCardComponent,
    CreateUpdateSubjectComponent,
    ViewAllSubjectsComponent,
    StudyPlanComponent,
    ViewStudyPlanComponent,
    ViewStudentComponent,
    AdminStudentSubjectComponent,
    AddFinalGradesComponent,
    UpdateStudentSituationComponent
  ],
  bootstrap: []
})
export class AdminModule { }
