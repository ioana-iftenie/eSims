import { Injectable }                               from '@angular/core';
import { Http, Response, Headers, RequestOptions }  from '@angular/http';
import { Observable }                               from 'rxjs/Observable';

import 'rxjs/add/observable/throw';

@Injectable()
export class ErrorHandlerService {
    handleError(error: any) {
        let errorMessage: string;

        if (error instanceof Response) {
            const body = JSON.parse(error['_body']);
            
            errorMessage = body ? body.error_description || body.error : 'Internal server error';
        } else {
            if (error.error) {
                errorMessage = error.error;
            } else {
                errorMessage = error.message ? error.message : error.toString();
            }
        }

        console.log(errorMessage);
        return Observable.throw(errorMessage);
    }
}
