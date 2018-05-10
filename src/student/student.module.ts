import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { StudentScreenComponent } from './components/student-screen/student-screen.component';


@NgModule({
  declarations: [
    StudentScreenComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  exports: [
    StudentScreenComponent
  ],
  bootstrap: []
})
export class StudentModule { }
