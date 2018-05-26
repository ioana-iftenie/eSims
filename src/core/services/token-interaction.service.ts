import { Injectable }                               from '@angular/core';
import { Observable }                               from 'rxjs/Observable';
import { Router }                                   from '@angular/router';

@Injectable()
export class TokenInteractionService {
    constructor(private router: Router) {}
    
    tokenExists(): boolean {
        if (localStorage.getItem('expires_in') == undefined || localStorage.getItem('access_token') == undefined) {
            return false;
        }
        
        return true;
    }
    
    isValidToken(): boolean {
        let now = new Date();
        
        if (!this.tokenExists() || parseInt(localStorage.getItem('expires_in')) < now.getTime()) {
            return false;
        }

        return true;
    }

    isAdmin(): boolean {
        return localStorage.getItem('is_admin') == '1' ? true : false;
    }

    isStudent(): boolean {
        return localStorage.getItem('is_student') == '1' ? true : false;
    }

    isProfessor(): boolean {
        return localStorage.getItem('is_professor') == '1' ? true : false;
    }
    
    create(credentials: any): void {
        localStorage.setItem('access_token', credentials.access_token);
        localStorage.setItem('user_id', credentials.user_id);
        localStorage.setItem('is_admin', credentials.is_admin);
        localStorage.setItem('is_student', credentials.is_student);
        localStorage.setItem('is_professor', credentials.is_professor);

        let expires_in = new Date();
        localStorage.setItem('expires_in', (expires_in.getTime() + credentials.expires_in * 1000).toString());
    }
    
    clear(): void {
        localStorage.clear();
        this.router.navigate(['login']);
    }
}