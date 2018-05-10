import { BrowserModule }        from '@angular/platform-browser';
import { NgModule }             from '@angular/core';
import { FormsModule }          from '@angular/forms';
import { HttpClientModule }     from '@angular/common/http';

import { AppRoutingModule }     from './app-routing.module';

import { AppComponent }         from './app.component';

import { SharedModule }         from '../shared/shared.module';
import { CoreModule }           from '../core/core.module';
import { AdminModule }          from '../admin/admin.module';
import { StudentModule }        from '../student/student.module';
import { ProfessorModule }          from '../professor/professor.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AdminModule,
    SharedModule,
    CoreModule,
    StudentModule,
    ProfessorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
