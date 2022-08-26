import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { StatusAddComponent } from './status-add/status-add.component';

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
    // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    statusGrid: any;
    // #endregion

    // #region "constructor"
    constructor(public dialog: MatDialog, public configurationService: ConfigurationService, private config: UtilService, public customhttp: CustomHttpService) {
        this.tableConfig.showPagination = true;
        this.tableConfig.showView = false;
        this.tableConfig.showIcon = false;
        this.tableConfig.showEdit = true;
        this.tableConfig.showAdd = false;
        this.tableConfig.showDelete = true;
        this.tableConfig.columnConfig = [
            { PropertyName: "CarePlanStatusCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width: "15%" },
            { PropertyName: "CarePlanStatusDesc", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width: "60%" },
            { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width: "15%" }
        ];
    }
    // #endregion

    // #region "ngOnInit"  
    ngOnInit() {
        this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
        this.getStatusGridData();
    }
    // #endregion

    // #region "get data for grid"  
    getStatusGridData() {
        this.configurationService.getStatusList().then(res => {
            this.statusGrid = res;
        });
    }
    // #endregion

    // #region "add new data to Table"
    addNewStatus() {
        const newStatus = this.dialog.open(StatusAddComponent, {
            height: "auto",
            width: "25%",
            autoFocus: false,
        });
        newStatus.afterClosed().subscribe(result => {
            if (result == "Updated") {
                this.getStatusGridData();
            }
        });
    }
    // #endregion 

    // #region "Edit/Update Data of Table"
    editStatus(element: any) {
        this.configurationService.getStatusbyId(element.Item.CarePlanStatusID).then(res => {
            var editRecordforStatus = res;
            let editDetailsofStatus = this.dialog.open(StatusAddComponent, {
                data: editRecordforStatus,
                height: "auto",
                width: "25%",
                autoFocus: true,
            });
            editDetailsofStatus.afterClosed().subscribe(result => {
                if (result == "Updated") {
                    this.getStatusGridData();
                }
            });
        });
    }
    // #endregion  

    // #region "delete"
    deleteStatus(element: any) {
        this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
            if (res == true) {
                this.configurationService.deleteStatusRecord(element.Item.CarePlanStatusID).then(res => {
                    this.getStatusGridData();
                });
            }
        });
    }
    // #endregion 

}