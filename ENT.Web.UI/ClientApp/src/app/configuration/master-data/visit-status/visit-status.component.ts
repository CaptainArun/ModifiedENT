import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { VisitStatusAddComponent } from './visit-status-add/visit-status-add.component';

@Component({
  selector: 'app-visit-status',
  templateUrl: './visit-status.component.html',
  styleUrls: ['./visit-status.component.css']
})
export class VisitStatusComponent implements OnInit {
  // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    visitStatusGrid: any;
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
        { PropertyName: "VisitStatusCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width:"15%" },
        { PropertyName: "VisitStatusDescription", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width:"60%" },
        { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width:"15%" }       
      ];
    }
  // #endregion

  // #region "ngOnInit"  
    ngOnInit() {
      this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
      this.getVisitStatusGridData();
    }
  // #endregion

  // #region "get data for grid"  
    getVisitStatusGridData() {
      this.configurationService.getVisitStatusList().then(res => {
        this.visitStatusGrid = res;
      });
    }
  // #endregion

  // #region "add new data to Table"
    addNewVisitStatus() {
      const newVisitStatus = this.dialog.open(VisitStatusAddComponent, {
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newVisitStatus.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getVisitStatusGridData();
        }
      });
    }
  // #endregion 

  // #region "Edit/Update Data of Table"
    editVisitStatus(element: any) {
      this.configurationService.getVisitStatusRecordbyID(element.Item.VisitStatusId).then(res => {
        var editRecordforVisitStatus = res;
        let editDetailsofVisitStatus = this.dialog.open(VisitStatusAddComponent, {
          data: editRecordforVisitStatus,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofVisitStatus.afterClosed().subscribe(result => {
          if (result == "Updated") {
            this.getVisitStatusGridData();
          }
        });
      });
    }
  // #endregion  

  // #region "delete"
    deleteVisitStatus(element: any) {
      this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
        if (res == true) {
          this.configurationService.deleteVisitStatusRecord(element.Item.VisitStatusId).then(res => {
            this.getVisitStatusGridData();
          });
        }
      });
    }
  // #endregion 

}