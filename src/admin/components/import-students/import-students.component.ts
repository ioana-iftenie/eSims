import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';

import { AdminService } from '../../services/admin.services';

@Component({
    selector: 'import-students',
    templateUrl: './import-students.component.html',
    // styles: [':host { width: 100% }', require('./import-students.component.less')],
    styleUrls: ['./import-students.component.less'],
    providers: [AdminService]
})

export class ImportStudentsComponent {

    @ViewChild('fileInput') fileInput: ElementRef;

    alive: boolean;

    fileName: string;
    fileToUpload: File = null;
    errorMessage: string;
    errorRows: any;
    displayErrorRows: boolean;
    importStudentsResponse: any;
    isSuccess: boolean;

    hideTable: boolean;

    constructor(private http: HttpClient, private adminService: AdminService) {
    }

    ngOnInit() {
        this.alive = true;
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    openFileExplorer(event): void {
        this.fileInput.nativeElement.click()
    }

    readFile(event): void {
        const target: DataTransfer = <DataTransfer>(event.target);

        if (target.files.length > 1) {
            this.errorMessage = 'Cannot use multiple files';
            return;
        }

        this.fileName = event.target.files[0].name;
        this.fileToUpload = event.target.files[0];
    }

    importFile(): void {
        this.errorMessage = '';

        this.adminService.importStudents(this.fileToUpload, this.fileName)
        .takeWhile(() => this.alive)
        .subscribe(
            response => {             
                this.errorRows = response;
                console.log(response);
                if (response.errorCode == 0) {
                    this.isSuccess = true;
                } else {
                    this.isSuccess = false;
                }

                console.log(this.isSuccess)
                // this.displayErrorRows = response.errorCode != 2 ? true : false;
                if (response.wrongRows != undefined && response.wrongRows.length > 0) 
                    this.hideTable = false;
                else
                    this.hideTable = true;
                    console.log(this.hideTable)
            },
            error => {
                this.errorMessage = error;
                console.log(error)
            }
        );
    }

    closeTable(): void {
        this.hideTable = true;
    }
}