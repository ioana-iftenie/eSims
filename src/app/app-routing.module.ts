import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { LoginComponent }           from '../core/components/login/login.component';
import { AdminScreenComponent }     from '../admin/components/admin-screen/admin-screen.component';
import { StudentScreenComponent }   from '../student/components/student-screen/student-screen.component';
import { ProfessorScreenComponent } from '../professor/components/professor-screen/professor-screen.component';
import { HomeScreenComponent }          from '../core/components/home/home.component';

import { GenerateGroupsComponent }      from '../admin/components/generate-groups/generate-groups.component';

import { VerifyStudentService }         from '../core/services/verify-student.service';
import { VerifyAdminService }           from '../core/services/verify-admin.service';
import { VerifyProfessorService }       from '../core/services/verify-professor.service';
import { VerifyUserService }            from '../core/services/verify-user.service';
import { CreateUpdateSubjectComponent } from '../admin/components/subjects/create-update/create-update-subject.component';
import { ViewAllSubjectsComponent }     from '../admin/components/subjects/view-all/view-all-subjects.component';
import { StudyPlanComponent }           from '../admin/components/subjects/study-plan/study-plan.component';
import { ViewStudyPlanComponent }       from '../admin/components/subjects/view-study-plan/view-study-plan.component';
import { ViewStudentComponent } from '../admin/components/view-student/view-student.component';
import { AdminStudentSubjectComponent } from '../admin/components/subjects/student-subject/student-subject.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }, 
    {
      path: 'home',
      component: HomeScreenComponent,
      canActivate: [VerifyUserService]
    },
    {
      path: 'admin',
      component: AdminScreenComponent,
      canActivate: [VerifyAdminService]
    },
    {
      path: 'admin/generate-groups',
      component: GenerateGroupsComponent,
      canActivate: [VerifyAdminService]
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'student',
      component: StudentScreenComponent,
      canActivate: [VerifyStudentService]
    },
    {
      path: 'professor',
      component: ProfessorScreenComponent,
      canActivate: [VerifyProfessorService]
    },
    {
      path: 'admin/create-update-subject',
      component: CreateUpdateSubjectComponent,
      canActivate: [VerifyAdminService]
    },
    {
      path: 'admin/subjects',
      component: ViewAllSubjectsComponent,
      canActivate: [VerifyAdminService]
    },
    {
      path: 'admin/study-plan',
      component: StudyPlanComponent,
      canActivate: [VerifyAdminService]
    },
    {
      path: 'admin/view-study-plan',
      component: ViewStudyPlanComponent,
      canActivate: [VerifyAdminService]
    },
    {
      path: 'admin/view-students',
      component: ViewStudentComponent,
      canActivate: [VerifyAdminService]
    },
    {
      path: 'admin/create-student-subject',
      component: AdminStudentSubjectComponent,
      canActivate: [VerifyAdminService]
    },
    {
      path: '**',
      redirectTo: 'home',
      pathMatch: 'full'
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
