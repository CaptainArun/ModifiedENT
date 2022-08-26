import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { ProblemStatusAddComponent } from './problem-status-add/problem-status-add.component';

@Component({
    selector: 'app-problem-status',
    templateUrl: './problem-status.component.html',
    styleUrls: ['./problem-status.component.css']
})
export class ProblemStatusComponent implements OnInit {
    // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    problemStatusGrid: any;
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
            { PropertyName: "ProblemStatusCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width: "15%" },
            { PropertyName: "ProblemStatusDesc", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width: "60%" },
            { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width: "15%" }
        ];
    }
    // #endregion

    // #region "ngOnInit"  
    ngOnInit() {
        this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
        this.getProblemStatusGridData();
    }
    // #endregion

    // #region "get data for grid"  
    getProblemStatusGridData() {
        this.configurationService.getProblemStatusList().then(res => {
            this.problemStatusGrid = res;
        });
    }
    // #endregion

    // #region "add new data to Table"
    addNewProblemStatus() {
        const newProblemStatus = this.dialog.open(ProblemStatusAddComponent, {
            height: "auto",
            width: "25%",
            autoFocus: false,
        });
        newProblemStatus.afterClosed().subscribe(result => {
            if (result == "Updated") {
                this.getProblemStatusGridData();
            }
        });
    }
    // #endregion 

    // #region "Edit/Update Data of Table"
    editProblemStatus(element: any) {
        this.configurationService.getProblemStatusbyId(element.Item.ProblemStatusID).then(res => {
            var editRecordforProblemStatus = res;
            let editDetailsofProblemStatus = this.dialog.open(ProblemStatusAddComponent, {
                data: editRecordforProblemStatus,
                height: "auto",
                width: "25%",
                autoFocus: true,
            });
            editDetailsofProblemStatus.afterClosed().subscribe(result => {
                if (result == "Updated") {
                    this.getProblemStatusGridData();
                }
            });
        });
    }
    // #endregion  

    // #region "delete"
    deleteProblemStatus(element: any) {
        this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
            if (res == true) {
                this.configurationService.deleteProblemStatusRecord(element.Item.ProblemStatusID).then(res => {
                    this.getProblemStatusGridData();
                });
            }
        });
    }
    // #endregion 

}