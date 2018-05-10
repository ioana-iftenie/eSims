import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription }                 from 'rxjs/Subscription';
import { LoaderService }                from '../../services/loader.service';
import { LoaderState }                  from '../../models/loader.class';

@Component({
    selector: 'angular-loader',
    templateUrl: 'loader.component.html',
    styleUrls: ['loader.component.less']
})

export class LoaderComponent implements OnInit {
    show: boolean = false;
    private subscription: Subscription;
    
    constructor(private loaderService: LoaderService) {}

    ngOnInit() { 
        this.subscription = this.loaderService.loaderState
        .subscribe((state: LoaderState) => {
            this.show = state.show;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}