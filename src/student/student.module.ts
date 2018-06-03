import { BrowserModule }  from '@angular/platform-browser';
import { NgModule }       from '@angular/core';
import { RouterModule }   from '@angular/router';
import { FormsModule, ReactiveFormsModule }              from '@angular/forms';

import { StudentScreenComponent } from './components/student-screen/student-screen.component';
import { StudentNavigationComponent } from './components/student-navigation/student-navigation.component';
import { StudentService } from './services/student.services';
import { SharedModule } from '../shared/shared.module';
import { AddOptionalsComponent } from './components/add-optionals/add-optionals.component';


@NgModule({
  declarations: [
    StudentScreenComponent,
    StudentNavigationComponent,
    AddOptionalsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    StudentService
  ],
  exports: [
    StudentScreenComponent,
    StudentNavigationComponent,
    AddOptionalsComponent
  ],
  bootstrap: []
})
export class StudentModule { }
