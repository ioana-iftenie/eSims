import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'studentNameSearch'
})

export class StudentNameFilterPipe implements PipeTransform {
	transform(value, term) {
		if (value != undefined && term != undefined && term != '') {
			return value.filter((item) => item.name.toUpperCase().indexOf(term.toUpperCase()) != -1);
		} else {
			return value;
		}
	}
}