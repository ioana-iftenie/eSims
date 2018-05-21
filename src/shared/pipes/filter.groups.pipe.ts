import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'studentGroupSearch'
})

export class StudentGroupFilterPipe implements PipeTransform {
	transform(value, term) {
		if (value != undefined && term != undefined && term != '0') {
			return value.filter((item) => item.groupName.toUpperCase().indexOf(term.toUpperCase()) != -1);
		} else {
			return value;
		}
	}
}