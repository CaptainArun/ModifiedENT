import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { RequestedProcedureAddComponent } from './requested-procedure-add/requested-procedure-add.component';

@Component({
    selector: 'app-requested-procedure',
    templateUrl: './requested-procedure.component.html',
    styleUrls: ['./requested-procedure.component.css']
})
export class RequestedProcedureComponent implements OnInit {
    // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    requestedProcedureGrid: any;
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
            { PropertyName: "RequestedProcedureCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width: "15%" },
            { PropertyName: "RequestedProcedureDescription", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width: "60%" },
            { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width: "15%" }
        ];
    }
    // #endregion

    // #region "ngOnInit"  
    ngOnInit() {
        this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
        this.getRequestedProcedureGridData();
    }
    // #endregion

    // #region "get data for grid"  
    getRequestedProcedureGridData() {
        this.configurationService.getRequestedProcedureList().then(res => {
            this.requestedProcedureGrid = res;
        });
    }
    // #endregion

    // #region "add new data to Table"
    addNewRequestedProcedure() {
        const newRequestedProcedure = this.dialog.open(RequestedProcedureAddComponent, {
            height: "auto",
            width: "25%",
            autoFocus: false,
        });
        newRequestedProcedure.afterClosed().subscribe(result => {
            if (result == "Updated") {
                this.getRequestedProcedureGridData();
            }
        });
    }
    // #endregion 

    // #region "Edit/Update Data of Table"
    editRequestedProcedure(element: any) {
        this.configurationService.getRequestedProcedurebyId(element.Item.RequestedProcedureId).then(res => {
            var editRecordforRequestedProcedure = res;
            let editDetailsofRequestedProcedure = this.dialog.open(RequestedProcedureAddComponent, {
                data: editRecordforRequestedProcedure,
                height: "auto",
                width: "25%",
                autoFocus: true,
            });
            editDetailsofRequestedProcedure.afterClosed().subscribe(result => {
                if (result == "Updated") {
                    this.getRequestedProcedureGridData();
                }
            });
        });
    }
    // #endregion  

    // #region "delete"
    deleteRequestedProcedure(element: any) {
        this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
            if (res == true) {
                this.configurationService.deleteRequestedProcedureRecord(element.Item.RequestedProcedureId).then(res => {
                    this.getRequestedProcedureGridData();
                });
            }
        });
    }
    // #endregion 

}