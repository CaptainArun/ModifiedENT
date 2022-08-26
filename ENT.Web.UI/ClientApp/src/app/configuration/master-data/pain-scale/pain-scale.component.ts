import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { PainScaleAddComponent } from './pain-scale-add/pain-scale-add.component';

@Component({
    selector: 'app-pain-scale',
    templateUrl: './pain-scale.component.html',
    styleUrls: ['./pain-scale.component.css']
})
export class PainScaleComponent implements OnInit {
    // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    painScaleGrid: any;
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
            { PropertyName: "PainScaleCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width: "15%" },
            { PropertyName: "PainScaleDesc", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width: "60%" },
            { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width: "15%" }
        ];
    }
    // #endregion

    // #region "ngOnInit"  
    ngOnInit() {
        this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
        this.getPainScaleGridData();
    }
    // #endregion

    // #region "get data for grid"  
    getPainScaleGridData() {
        this.configurationService.getPainScaleList().then(res => {
            this.painScaleGrid = res;
        });
    }
    // #endregion

    // #region "add new data to Table"
    addNewPainScale() {
        const newPainScale = this.dialog.open(PainScaleAddComponent, {
            height: "auto",
            width: "25%",
            autoFocus: false,
        });
        newPainScale.afterClosed().subscribe(result => {
            if (result == "Updated") {
                this.getPainScaleGridData();
            }
        });
    }
    // #endregion 

    // #region "Edit/Update Data of Table"
    editPainScale(element: any) {
        this.configurationService.getPainScalebyId(element.Item.PainScaleID).then(res => {
            var editRecordforPainScale = res;
            let editDetailsofPainScale = this.dialog.open(PainScaleAddComponent, {
                data: editRecordforPainScale,
                height: "auto",
                width: "25%",
                autoFocus: true,
            });
            editDetailsofPainScale.afterClosed().subscribe(result => {
                if (result == "Updated") {
                    this.getPainScaleGridData();
                }
            });
        });
    }
    // #endregion  

    // #region "delete"
    deletePainScale(element: any) {
        this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
            if (res == true) {
                this.configurationService.deletePainScaleRecord(element.Item.PainScaleID).then(res => {
                    this.getPainScaleGridData();
                });
            }
        });
    }
    // #endregion 

}