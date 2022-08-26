import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { ProcedureStatusAddComponent } from './procedure-status-add/procedure-status-add.component';

@Component({
    selector: 'app-procedure-status',
    templateUrl: './procedure-status.component.html',
    styleUrls: ['./procedure-status.component.css']
})
export class ProcedureStatusComponent implements OnInit {
    // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    procedureStatusGrid: any;
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
            { PropertyName: "ProcedureStatusCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width: "15%" },
            { PropertyName: "ProcedureStatusDesc", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width: "60%" },
            { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width: "15%" }
        ];
    }
    // #endregion

    // #region "ngOnInit"  
    ngOnInit() {
        this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
        this.getProcedureStatusGridData();
    }
    // #endregion

    // #region "get data for grid"  
    getProcedureStatusGridData() {
        this.configurationService.getProcedureStatusList().then(res => {
            this.procedureStatusGrid = res;
        });
    }
    // #endregion

    // #region "add new data to Table"
    addNewProcedureStatus() {
        const newProcedureStatus = this.dialog.open(ProcedureStatusAddComponent, {
            height: "auto",
            width: "25%",
            autoFocus: false,
        });
        newProcedureStatus.afterClosed().subscribe(result => {
            if (result == "Updated") {
                this.getProcedureStatusGridData();
            }
        });
    }
    // #endregion 

    // #region "Edit/Update Data of Table"
    editProcedureStatus(element: any) {
        this.configurationService.getProcedureStatusbyId(element.Item.ProcedureStatusID).then(res => {
            var editRecordforProcedureStatus = res;
            let editDetailsofProcedureStatus = this.dialog.open(ProcedureStatusAddComponent, {
                data: editRecordforProcedureStatus,
                height: "auto",
                width: "25%",
                autoFocus: true,
            });
            editDetailsofProcedureStatus.afterClosed().subscribe(result => {
                if (result == "Updated") {
                    this.getProcedureStatusGridData();
                }
            });
        });
    }
    // #endregion  

    // #region "delete"
    deleteProcedureStatus(element: any) {
        this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
            if (res == true) {
                this.configurationService.deleteProcedureStatusRecord(element.Item.ProcedureStatusID).then(res => {
                    this.getProcedureStatusGridData();
                });
            }
        });
    }
    // #endregion 

}