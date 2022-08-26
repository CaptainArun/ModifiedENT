import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { SymptomsAddComponent } from './symptoms-add/symptoms-add.component';

@Component({
    selector: 'app-symptoms',
    templateUrl: './symptoms.component.html',
    styleUrls: ['./symptoms.component.css']
})
export class SymptomsComponent implements OnInit {
    // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    symptomsGrid: any;
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
            { PropertyName: "SymptomsCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width: "15%" },
            { PropertyName: "SymptomsDescription", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width: "60%" },
            { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width: "15%" }
        ];
    }
    // #endregion

    // #region "ngOnInit"  
    ngOnInit() {
        this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
        this.getSymptomsGridData();
    }
    // #endregion

    // #region "get data for grid"  
    getSymptomsGridData() {
        this.configurationService.getSymptomsList().then(res => {
            this.symptomsGrid = res;
        });
    }
    // #endregion

    // #region "add new data to Table"
    addNewSymptoms() {
        const newSymptoms = this.dialog.open(SymptomsAddComponent, {
            height: "auto",
            width: "25%",
            autoFocus: false,
        });
        newSymptoms.afterClosed().subscribe(result => {
            if (result == "Updated") {
                this.getSymptomsGridData();
            }
        });
    }
    // #endregion 

    // #region "Edit/Update Data of Table"
    editSymptoms(element: any) {
        this.configurationService.getSymptombyId(element.Item.SymptomsId).then(res => {
            var editRecordforSymptoms = res;
            let editDetailsofSymptoms = this.dialog.open(SymptomsAddComponent, {
                data: editRecordforSymptoms,
                height: "auto",
                width: "25%",
                autoFocus: true,
            });
            editDetailsofSymptoms.afterClosed().subscribe(result => {
                if (result == "Updated") {
                    this.getSymptomsGridData();
                }
            });
        });
    }
    // #endregion  

    // #region "delete"
    deleteSymptoms(element: any) {
        this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
            if (res == true) {
                this.configurationService.deleteSymptomRecord(element.Item.SymptomsId).then(res => {
                    this.getSymptomsGridData();
                });
            }
        });
    }
    // #endregion 

}