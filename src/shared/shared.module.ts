import { BrowserModule }                                    from '@angular/platform-browser';
import { NgModule }                                         from '@angular/core';
import { FormsModule }                                      from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } 	from '@angular/common/http';
import { Http, XHRBackend, RequestOptions }					from '@angular/http';
import { RouterModule }   								    from '@angular/router';

import { AdminScreenComponent }     from '../admin/components/admin-screen/admin-screen.component';
import { AdminNavigationComponent } from './components/admin-navigation/admin-navigation.component';
import { SharedService }            from './services/shared.service';

import { SpecializeFormatPipe }     from './pipes/format.specialize.pipe';
import { RankFormatPipe }           from './pipes/format.rank.pipe';
import { SemesterFormatPipe }       from './pipes/format.semester.pipe';
import { StudyYearFormatPipe }      from './pipes/format.study-year.pipe';
import { StudentNameFilterPipe } from './pipes/filter.student-name.pipe';
import { StudentGroupFilterPipe } from './pipes/filter.groups.pipe';

@NgModule({
  declarations: [
      AdminNavigationComponent,
      SpecializeFormatPipe,
      RankFormatPipe,
      SemesterFormatPipe,
      StudyYearFormatPipe,
      StudentNameFilterPipe,
      StudentGroupFilterPipe
  ],
  imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      RouterModule
  ],
  providers: [
      SharedService
  ],
  exports: [
      AdminNavigationComponent,
      SpecializeFormatPipe,
      RankFormatPipe,
      SemesterFormatPipe,
      StudyYearFormatPipe,
      StudentNameFilterPipe,
      StudentGroupFilterPipe
  ],
  bootstrap: []
})
export class SharedModule { }
