import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { ProfessorScreenComponent } from './components/professor-screen/professor-screen.component';
import { SharedModule } from '../shared/shared.module';
import { ProfessorService } from './services/professor.services';

@NgModule({
  declarations: [
    ProfessorScreenComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    ProfessorService
  ],
  exports: [
    ProfessorScreenComponent
  ],
  bootstrap: []
})
export class ProfessorModule { }
