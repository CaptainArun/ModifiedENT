import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { TreatmentTypeAddComponent } from './treatment-type-add/treatment-type-add.component';

@Component({
    selector: 'app-treatment-type',
    templateUrl: './treatment-type.component.html',
    styleUrls: ['./treatment-type.component.css']
})
export class TreatmentTypeComponent implements OnInit {
    // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    treatmentTypeGrid: any;
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
            { PropertyName: "TreatmentTypeCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width: "15%" },
            { PropertyName: "TreatmentTypeDesc", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width: "60%" },
            { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width: "15%" }
        ];
    }
    // #endregion

    // #region "ngOnInit"  
    ngOnInit() {
        this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
        this.getTreatmentTypeGridData();
    }
    // #endregion

    // #region "get data for grid"  
    getTreatmentTypeGridData() {
        this.configurationService.getTreatmentTypeList().then(res => {
            this.treatmentTypeGrid = res;
        });
    }
    // #endregion

    // #region "add new data to Table"
    addNewTreatmentType() {
        const newTreatmentType = this.dialog.open(TreatmentTypeAddComponent, {
            height: "auto",
            width: "25%",
            autoFocus: false,
        });
        newTreatmentType.afterClosed().subscribe(result => {
            if (result == "Updated") {
                this.getTreatmentTypeGridData();
            }
        });
    }
    // #endregion 

    // #region "Edit/Update Data of Table"
    editTreatmentType(element: any) {
        this.configurationService.getTreatmentTypebyId(element.Item.TreatmentTypeID).then(res => {
            var editRecordforTreatmentType = res;
            let editDetailsofTreatmentType = this.dialog.open(TreatmentTypeAddComponent, {
                data: editRecordforTreatmentType,
                height: "auto",
                width: "25%",
                autoFocus: true,
            });
            editDetailsofTreatmentType.afterClosed().subscribe(result => {
                if (result == "Updated") {
                    this.getTreatmentTypeGridData();
                }
            });
        });
    }
    // #endregion  

    // #region "delete"
    deleteTreatmentType(element: any) {
        this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
            if (res == true) {
                this.configurationService.deleteTreatmentTypeRecord(element.Item.TreatmentTypeID).then(res => {
                    this.getTreatmentTypeGridData();
                });
            }
        });
    }
    // #endregion 

}