import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { ProblemAreaAddComponent } from './problem-area-add/problem-area-add.component';

@Component({
    selector: 'app-problem-area',
    templateUrl: './problem-area.component.html',
    styleUrls: ['./problem-area.component.css']
})
export class ProblemAreaComponent implements OnInit {
    // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    problemAreaGrid: any;
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
            { PropertyName: "ProblemAreaCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width: "15%" },
            { PropertyName: "ProblemAreaDescription", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width: "60%" },
            { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width: "15%" }
        ];
    }
    // #endregion

    // #region "ngOnInit"  
    ngOnInit() {
        this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
        this.getProblemAreaGridData();
    }
    // #endregion

    // #region "get data for grid"  
    getProblemAreaGridData() {
        this.configurationService.getProblemAreasList().then(res => {
            this.problemAreaGrid = res;
        });
    }
    // #endregion

    // #region "add new data to Table"
    addNewProblemArea() {
        const newProblemArea = this.dialog.open(ProblemAreaAddComponent, {
            height: "auto",
            width: "25%",
            autoFocus: false,
        });
        newProblemArea.afterClosed().subscribe(result => {
            if (result == "Updated") {
                this.getProblemAreaGridData();
            }
        });
    }
    // #endregion 

    // #region "Edit/Update Data of Table"
    editProblemArea(element: any) {
        this.configurationService.getProblemAreabyId(element.Item.ProblemAreaId).then(res => {
            var editRecordforProblemArea = res;
            let editDetailsofProblemArea = this.dialog.open(ProblemAreaAddComponent, {
                data: editRecordforProblemArea,
                height: "auto",
                width: "25%",
                autoFocus: true,
            });
            editDetailsofProblemArea.afterClosed().subscribe(result => {
                if (result == "Updated") {
                    this.getProblemAreaGridData();
                }
            });
        });
    }
    // #endregion  

    // #region "delete"
    deleteProblemArea(element: any) {
        this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
            if (res == true) {
                this.configurationService.deleteProblemAreaRecord(element.Item.ProblemAreaId).then(res => {
                    this.getProblemAreaGridData();
                });
            }
        });
    }
    // #endregion 

}