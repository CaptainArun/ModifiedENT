import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { RecordedDuringAddComponent } from './recorded-during-add/recorded-during-add.component';

@Component({
  selector: 'app-recorded-during',
  templateUrl: './recorded-during.component.html',
  styleUrls: ['./recorded-during.component.css']
})
export class RecordedDuringComponent implements OnInit {
    // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    recordedDuringGrid: any;
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
        { PropertyName: "RecordedDuringCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width:"15%" },
        { PropertyName: "RecordedDuringDescription", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width:"60%" },
        { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width:"15%" }       
      ];
    }
  // #endregion

  // #region "ngOnInit"  
    ngOnInit() {
      this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
      this.getRecordedDuringGridData();
    }
  // #endregion

  // #region "get data for grid"  
    getRecordedDuringGridData() {
      this.configurationService.getRecordedDuringList().then(res => {
        this.recordedDuringGrid = res;
      });
    }
  // #endregion

  // #region "add new data to Table"
    addNewRecordedDuring() {
      const newRecordedDuring = this.dialog.open(RecordedDuringAddComponent, {
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newRecordedDuring.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getRecordedDuringGridData();
        }
      });
    }
  // #endregion 

  // #region "Edit/Update Data of Table"
    editRecordedDuring(element: any) {
      this.configurationService.getRecordedDuringbyID(element.Item.RecordedDuringId).then(res => {
        var editRecordforRecordedDuring = res;
        let editDetailsofRecordedDuring = this.dialog.open(RecordedDuringAddComponent, {
          data: editRecordforRecordedDuring,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofRecordedDuring.afterClosed().subscribe(result => {
          if (result == "Updated") {
            this.getRecordedDuringGridData();
          }
        });
      });
    }
  // #endregion  

  // #region "delete"
    deleteRecordedDuring(element: any) {
      this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
        if (res == true) {
          this.configurationService.deleteRecordedDuringRecord(element.Item.RecordedDuringId).then(res => {
            this.getRecordedDuringGridData();
          });
        }
      });
    }
  // #endregion 

}