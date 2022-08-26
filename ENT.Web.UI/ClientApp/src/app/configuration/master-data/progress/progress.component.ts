import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { ProgressAddComponent } from './progress-add/progress-add.component';

@Component({
    selector: 'app-progress',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
    // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    progressGrid: any;
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
            { PropertyName: "CarePlanProgressCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width: "15%" },
            { PropertyName: "CarePlanProgressDesc", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width: "60%" },
            { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width: "15%" }
        ];
    }
    // #endregion

    // #region "ngOnInit"  
    ngOnInit() {
        this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
        this.getProgressGridData();
    }
    // #endregion

    // #region "get data for grid"  
    getProgressGridData() {
        this.configurationService.getProgressList().then(res => {
            this.progressGrid = res;
        });
    }
    // #endregion

    // #region "add new data to Table"
    addNewProgress() {
        const newProgress = this.dialog.open(ProgressAddComponent, {
            height: "auto",
            width: "25%",
            autoFocus: false,
        });
        newProgress.afterClosed().subscribe(result => {
            if (result == "Updated") {
                this.getProgressGridData();
            }
        });
    }
    // #endregion 

    // #region "Edit/Update Data of Table"
    editProgress(element: any) {
        this.configurationService.getProgressbyId(element.Item.CarePlanProgressID).then(res => {
            var editRecordforProgress = res;
            let editDetailsofProgress = this.dialog.open(ProgressAddComponent, {
                data: editRecordforProgress,
                height: "auto",
                width: "25%",
                autoFocus: true,
            });
            editDetailsofProgress.afterClosed().subscribe(result => {
                if (result == "Updated") {
                    this.getProgressGridData();
                }
            });
        });
    }
    // #endregion  

    // #region "delete"
    deleteProgress(element: any) {
        this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
            if (res == true) {
                this.configurationService.deleteProgressRecord(element.Item.CarePlanProgressID).then(res => {
                    this.getProgressGridData();
                });
            }
        });
    }
    // #endregion 

}