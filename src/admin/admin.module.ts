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


@NgModule({
  declarations: [
    AdminScreenComponent,
    ImportStudentsComponent,
    TableComponent,
    GenerateGroupsCardComponent, // Remove wen needed
    GenerateGroupsComponent, // Remove wen needed
    CreateUpdateSubjectCardComponent,
    ViewAllSubjectsCardComponent,
    StudyPlanCardComponent,
    CreateUpdateSubjectComponent,
    ViewAllSubjectsComponent,
    StudyPlanComponent
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
    StudyPlanCardComponent,
    CreateUpdateSubjectComponent,
    ViewAllSubjectsComponent,
    StudyPlanComponent
  ],
  bootstrap: []
})
export class AdminModule { }
