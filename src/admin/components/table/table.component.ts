import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';

@Component({
    selector: 'table-component',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.less'],
})

export class TableComponent {
    
    constructor(private http: HttpClient) {
    }

    @Input() 
    rowsToDisplay: any;

    @Output() 
    closeTable = new EventEmitter();

    emitCloseTable($event: any) {
        this.closeTable.emit($event);
    }
    
}