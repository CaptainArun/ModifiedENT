import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { UrgencyAddComponent } from './urgency-add/urgency-add.component';

@Component({
  selector: 'app-urgency',
  templateUrl: './urgency.component.html',
  styleUrls: ['./urgency.component.css']
})
export class UrgencyComponent implements OnInit {
  // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    urgencyGrid: any;
  // #endregion
  
  // #region "constructor"
    constructor(public dialog: MatDialog, public configurationService: ConfigurationService, private config: UtilService, public customhttp: CustomHttpService) 
    { 
      this.tableConfig.showPagination = true;
      this.tableConfig.showView = false;
      this.tableConfig.showIcon = false;
      this.tableConfig.showEdit = true;
      this.tableConfig.showAdd = false;
      this.tableConfig.showDelete = true;
      this.tableConfig.columnConfig = [
        { PropertyName: "UrgencyTypeCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width:"15%" },
        { PropertyName: "UrgencyTypeDescription", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width:"60%" },
        { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width:"15%" }       
      ];
    }
  // #endregion

  // #region "ngOnInit"  
    ngOnInit() {
      this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
      this.getUrgencyGridData();
    }
  // #endregion

  // #region "get data for grid"  
    getUrgencyGridData() {
      this.configurationService.getUrgencyList().then(res => {
        this.urgencyGrid = res;
      });
    }
  // #endregion

  // #region "add new data to Table"
    addNewUrgency() {
      const newUrgency = this.dialog.open(UrgencyAddComponent, {
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newUrgency.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getUrgencyGridData();
        }
      });
    }
  // #endregion 

  // #region "Edit/Update Data of Table"
    editUrgency(element: any) {
      this.configurationService.getUrgencyRecordbyID(element.Item.UrgencyTypeId).then(res => {
        var editRecordforUrgency = res;
        let editDetailsofUrgency = this.dialog.open(UrgencyAddComponent, {
          data: editRecordforUrgency,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofUrgency.afterClosed().subscribe(result => {
          if (result == "Updated") {
            this.getUrgencyGridData();
          }
        });
      });
    }
  // #endregion  

  // #region "delete"
    deleteUrgency(element: any) {
      this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
        if (res == true) {
          this.configurationService.deleteUrgencyRecord(element.Item.UrgencyTypeId).then(res => {
            this.getUrgencyGridData();
          });
        }
      });
    }
  // #endregion 

}