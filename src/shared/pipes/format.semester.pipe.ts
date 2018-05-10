// tslint:disable:indent

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'semesterFormat'
})

export class SemesterFormatPipe implements PipeTransform {
	transform(value) {
		switch (value) {
            case '1':
                return 'Semester I';
            case '2':
                return 'Semester II';
            default:
                return 'Unmapped Semester';
        }
	}
}
