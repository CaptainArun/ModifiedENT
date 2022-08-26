import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { ProblemTypeAddComponent } from './problem-type-add/problem-type-add.component';

@Component({
    selector: 'app-problem-type',
    templateUrl: './problem-type.component.html',
    styleUrls: ['./problem-type.component.css']
})
export class ProblemTypeComponent implements OnInit {
    // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    problemTypeGrid: any;
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
            { PropertyName: "ProblemTypeCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width: "15%" },
            { PropertyName: "ProblemTypeDescription", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width: "60%" },
            { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width: "15%" }
        ];
    }
    // #endregion

    // #region "ngOnInit"  
    ngOnInit() {
        this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
        this.getProblemTypeGridData();
    }
    // #endregion

    // #region "get data for grid"  
    getProblemTypeGridData() {
        this.configurationService.getProblemTypeList().then(res => {
            this.problemTypeGrid = res;
        });
    }
    // #endregion

    // #region "add new data to Table"
    addNewProblemType() {
        const newProblemType = this.dialog.open(ProblemTypeAddComponent, {
            height: "auto",
            width: "25%",
            autoFocus: false,
        });
        newProblemType.afterClosed().subscribe(result => {
            if (result == "Updated") {
                this.getProblemTypeGridData();
            }
        });
    }
    // #endregion 

    // #region "Edit/Update Data of Table"
    editProblemType(element: any) {
        this.configurationService.getProblemTypebyId(element.Item.ProblemTypeId).then(res => {
            var editRecordforProblemType = res;
            let editDetailsofProblemType = this.dialog.open(ProblemTypeAddComponent, {
                data: editRecordforProblemType,
                height: "auto",
                width: "25%",
                autoFocus: true,
            });
            editDetailsofProblemType.afterClosed().subscribe(result => {
                if (result == "Updated") {
                    this.getProblemTypeGridData();
                }
            });
        });
    }
    // #endregion  

    // #region "delete"
    deleteProblemType(element: any) {
        this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
            if (res == true) {
                this.configurationService.deleteProblemTypeRecord(element.Item.ProblemTypeId).then(res => {
                    this.getProblemTypeGridData();
                });
            }
        });
    }
    // #endregion 

}