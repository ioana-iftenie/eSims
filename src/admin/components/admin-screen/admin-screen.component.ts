import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgClass }           from '@angular/common';
import { HttpClient }        from '@angular/common/http';

import { AdminService } from '../../services/admin.services';
import { AdminModule } from '../../admin.module';
import { User } from '../../../core/models/user.class';

@Component({
    selector: 'admin',
    templateUrl: './admin-screen.component.html',
    styleUrls: ['./admin-screen.component.less'],
    providers: [AdminService]
})

export class AdminScreenComponent {

    @ViewChild('fileInput') fileInput: ElementRef;
    
    @Input()
    userInfo: User;

    alive: boolean;

    constructor(private http: HttpClient, private adminService: AdminService) {
    }

    ngOnInit() {
        this.alive = true;
    }

    ngOnDestroy(): void {
        this.alive = false;
    }
}