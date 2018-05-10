import { Injectable, Injector }     from '@angular/core';
import { PlatformLocation }         from '@angular/common';
import { Router }                   from '@angular/router';
import { Observable }               from 'rxjs/Observable';

import { TokenInteractionService }  from './token-interaction.service';
import { LoginService }             from './login.services';
import { LoaderService }            from './loader.service';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/do';

import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { RequestOptionsArgs } from '@angular/http';

@Injectable()
export class InterceptedHttp implements HttpInterceptor {
    cachedRequests: Array<HttpRequest<any>> = [];

    constructor(private router: Router, private token: TokenInteractionService, private loader: LoaderService, private inj: Injector) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const auth = this.inj.get(LoginService);

        const headers = {};

        if (!request.headers.get('Accept')) {
            headers['Accept'] = 'application/json';
        }

        if (request.url.indexOf('auth') === -1) {
            if (!request.headers.get('Authorization')) {
                headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
                headers['x-access-token'] = localStorage.getItem('access_token');
            } else {
                headers['Authorization'] = request.headers.get('Authorization');
                headers['x-access-token'] = request.headers.get('x-access-token');
            }
        }

        const clonedRequest = request.clone({
            setHeaders: headers,
            url: this.updateUrl(request.url)
        });

        this.loader.show();

        if (request.url.indexOf('auth') === -1) {
            return next.handle(clonedRequest)
                .do(event => {})
                .finally(() => {
                    this.loader.hide();
                })
                .catch(err => {
                    if (err.status === 401 || err.status === 0) {
                        this.token.clear();
                        this.router.navigate(['login']);
                    } else if (err.status === 404) {
                        this.router.navigate(['404']);
                        return Observable.throw(err);
                    } else {
                        return Observable.throw(err.error.error);
                    }
                });
        } else {
            return next.handle(clonedRequest)
            .catch((error) => {
                return Observable.throw(error);
            })
            .finally(() => {
                this.loader.hide();
            });
        }
    }

    private updateUrl(req: string) {
        return req;
    }
}
