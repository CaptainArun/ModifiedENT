import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderModule } from 'ngx-order-pipe';
import { Routes, RouterModule } from '@angular/router';
import { ColumnConfig } from './columnConfig';

import { BMSMessageBox } from './bmsmsgbox/bmsmsgbox.component';

import { BMSMenu, IMenu } from './bmsmenu/bmsmenu.component';
import { BMSMenuItem } from './bmsmenu/bmsmenu-item.component';
import { MaterialModuleControls } from '../material.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// import { BMSTableModule} from './bmstable/bms-table.module';


@NgModule({
    imports: [
        CommonModule,
        OrderModule,
        NgbDropdownModule,
        MaterialModuleControls,
        RouterModule
    ],
    declarations: [ BMSMenuItem, BMSMenu, BMSMessageBox],
    providers: [],
    exports: [CommonModule,  BMSMenuItem, BMSMenu],
    entryComponents: [BMSMessageBox]
})
export class BMSUxModule {

}

