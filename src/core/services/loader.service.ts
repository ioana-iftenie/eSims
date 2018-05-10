// tslint:disable:indent

import { Injectable }	from '@angular/core';
import { Subject } 		from 'rxjs/Subject';
import { LoaderState }	from '../models/loader.class';

@Injectable()
export class LoaderService {
	private loaderSubject = new Subject<LoaderState>();
	loaderState = this.loaderSubject.asObservable();
	loaderCount = 0;

	constructor() {}

	show() {
		this.loaderSubject.next(<LoaderState>{show: true});
		this.loaderCount++;
	}

	hide(forceHide?: boolean) {
		this.loaderCount--;

		if (!this.loaderCount || forceHide) {
			this.loaderSubject.next(<LoaderState>{show: false});
		}
	}
}
