import { BrowserModule } 								from '@angular/platform-browser';
import { NgModule }                                     from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } 	from '@angular/common/http';
import { Http, XHRBackend, RequestOptions }				from '@angular/http';
import { Router }                          				from '@angular/router';
import { RouterModule }   								from '@angular/router';
import { FormsModule } 									from '@angular/forms';

import { ErrorHandlerService }                          from './services/error-handler.service';
import { TokenInteractionService } 						from './services/token-interaction.service';
import { VerifyAdminService } 							from './services/verify-admin.service';
import { VerifyStudentService } 						from './services/verify-student.service';
import { VerifyProfessorService } 						from './services/verify-professor.service';
import { LoaderService } 								from './services/loader.service';
import { VerifyUserService } 							from './services/verify-user.service';
import { LoginService } 								from './services/login.services';
import { HomepageService } 								from './services/homepage.service';

import { LoaderComponent } 								from './components/loader/loader.component';
import { LoginComponent } 								from './components/login/login.component';
import { HomeScreenComponent } from './components/home/home.component';

import { InterceptedHttp } from './services/http.interceptor';
import { AdminModule } from '../admin/admin.module';
import { StudentModule } from '../student/student.module';
import { ProfessorModule } from '../professor/professor.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	imports: [
		HttpClientModule,
		FormsModule,
		BrowserModule,
		AdminModule,
		StudentModule,
		ProfessorModule,
		SharedModule,
		RouterModule
	],
	exports: [
		LoaderComponent,
		LoginComponent,
		HomeScreenComponent
	],
	declarations: [
		LoaderComponent,
		LoginComponent,
		HomeScreenComponent
	],
	providers: [
		ErrorHandlerService,
		VerifyAdminService,
		VerifyStudentService,
		VerifyProfessorService,
		VerifyUserService,
		LoaderService,
		LoginService,
		HomepageService,
		TokenInteractionService,
		{
            provide: HTTP_INTERCEPTORS,
			useClass: InterceptedHttp,
			multi: true
        }
	]
})

export class CoreModule {}