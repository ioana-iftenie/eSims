// tslint:disable:indent

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'studyYearFormat'
})

export class StudyYearFormatPipe implements PipeTransform {
	transform(value) {
		switch (value.toString()) {
            case '1':
                return 'Study Year I';
            case '2':
                return 'Study Year II';
            case '3':
                return 'Study Year III';
            default:
                return 'Unmapped Study Year';
        }
	}
}
