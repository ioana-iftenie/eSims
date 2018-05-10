// tslint:disable:indent

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'specializeFormat'
})

export class SpecializeFormatPipe implements PipeTransform {
	transform(value) {
		switch (value) {
            case 'I':
                return 'Informatics';
            case 'SE':
                return 'Software Engineering';
            case 'CL':
                return 'Computational Linguistics';
            case 'CO':
                return 'Computational Optimization';
            case 'DS':
                return 'Distributed Systems';
            case 'IS':
                return 'Information Security';
            default:
                return 'Unmapped Specialize';
        }
	}
}