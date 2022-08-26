import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { BillingStatusAddComponent } from './billingStatus-add/billingStatus-add.component';

@Component({
    selector: 'app-billingStatus',
    templateUrl: './billingStatus.component.html',
    styleUrls: ['./billingStatus.component.css']
})
export class BillingStatusComponent implements OnInit {
    // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    billingStatusGrid: any;
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
            { PropertyName: "BillingMasterStatusCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width: "15%" },
            { PropertyName: "BillingMasterStatusDescription", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width: "60%" },
            { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width: "15%" }
        ];
    }
    // #endregion

    // #region "ngOnInit"  
    ngOnInit() {
        this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
        this.getBillingStatusGridData();
    }
    // #endregion

    // #region "get data for grid"  
    getBillingStatusGridData() {
        this.configurationService.getBillingStatusList().then(res => {
            this.billingStatusGrid = res;
            
        });
    }
    // #endregion

    // #region "add new data to Table"
    addNewBillingStatus() {
        const newBillingStatus = this.dialog.open(BillingStatusAddComponent, {
            height: "auto",
            width: "25%",
            autoFocus: false,
        });
        newBillingStatus.afterClosed().subscribe(result => {
            if (result == "Updated") {
                this.getBillingStatusGridData();
            }
        });
    }
    // #endregion 

    // #region "Edit/Update Data of Table"
    editBillingStatus(element: any) {
        
        this.configurationService.getBillingStatusbyId(element.Item.BillingMasterStatusId).then(res => {
            var editRecordforBillingStatus = res;
            let editDetailsofBillingStatus = this.dialog.open(BillingStatusAddComponent, {
                data: editRecordforBillingStatus,
                height: "auto",
                width: "25%",
                autoFocus: true,
            });
            editDetailsofBillingStatus.afterClosed().subscribe(result => {
                if (result == "Updated") {
                    this.getBillingStatusGridData();
                }
            });
        });
    }
    // #endregion  

    // #region "delete"
    deleteBillingStatus(element: any) {
        this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
            if (res == true) {
                this.configurationService.deleteBillingStatusRecord(element.Item.BillingMasterStatusID).then(res => {
                    this.getBillingStatusGridData();
                });
            }
        });
    }
    // #endregion 

}