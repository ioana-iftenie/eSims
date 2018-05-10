import { Injectable } 			  	                    from '@angular/core';
import { Router, CanActivate }                          from '@angular/router';
import { Observable }                                   from 'rxjs/Observable';
import { ActivatedRouteSnapshot, RouterStateSnapshot }  from '@angular/router';

import { TokenInteractionService }                      from './token-interaction.service';
import { LoginService }                                 from './login.services';

@Injectable()
export class VerifyProfessorService implements CanActivate {
	constructor(private auth: LoginService, private token: TokenInteractionService, private router: Router) {}

	canActivate(): Observable<boolean> | boolean {
		if (!this.token.isValidToken()) {
            this.token.clear();
            this.router.navigate(['login']);
		} else {
            if (!this.token.isProfessor()) {

                if (this.token.isStudent()) {
                    this.router.navigate(['student']);
                }

                if (this.token.isAdmin()) {
                    this.router.navigate(['admin']);
                }
                
                return false
            }
            
            return true;
        }
	}
}
