// tslint:disable:indent

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'rankFormat'
})

export class RankFormatPipe implements PipeTransform {
	transform(value) {
		switch (value) {
            case 'B':
                return 'Bachelor';
            case 'M':
                return 'Master';
            case 'D':
                return 'Doctorates';
            default:
                return 'Unmapped Degree';
        }
	}
}
