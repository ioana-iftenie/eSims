import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ProfessorScreenComponent } from './components/professor-screen/professor-screen.component';

@NgModule({
  declarations: [
    ProfessorScreenComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  exports: [
    ProfessorScreenComponent
  ],
  bootstrap: []
})
export class ProfessorModule { }
