import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { VisitTypeAddComponent } from './visit-type-add/visit-type-add.component';

@Component({
  selector: 'app-visit-type',
  templateUrl: './visit-type.component.html',
  styleUrls: ['./visit-type.component.css']
})
export class VisitTypeComponent implements OnInit {
  // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    visitTypeGrid: any;
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
        { PropertyName: "VisitTypeCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width:"15%" },
        { PropertyName: "VisitTypeDescription", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width:"60%" },
        { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width:"15%" }       
      ];
    }
  // #endregion

  // #region "ngOnInit"  
    ngOnInit() {
      this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
      this.getVisitTypeGridData();
    }
  // #endregion

  // #region "get data for grid"  
    getVisitTypeGridData() {
      this.configurationService.getVisitTypeList().then(res => {
        this.visitTypeGrid = res;
      });
    }
  // #endregion

  // #region "add new data to Table"
    addNewVisitType() {
      const newVisitType = this.dialog.open(VisitTypeAddComponent, {
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newVisitType.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getVisitTypeGridData();
        }
      });
    }
  // #endregion 

  // #region "Edit/Update Data of Table"
    editVisitType(element: any) {
      this.configurationService.getVisitTypeRecordbyID(element.Item.VisitTypeId).then(res => {
        var editRecordforVisitType = res;
        let editDetailsofVisitType = this.dialog.open(VisitTypeAddComponent, {
          data: editRecordforVisitType,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofVisitType.afterClosed().subscribe(result => {
          if (result == "Updated") {
            this.getVisitTypeGridData();
          }
        });
      });
    }
  // #endregion  

  // #region "delete"
    deleteVisitType(element: any) {
      this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
        if (res == true) {
          this.configurationService.deleteVisitTypeRecord(element.Item.VisitTypeId).then(res => {
            this.getVisitTypeGridData();
          });
        }
      });
    }
  // #endregion 

}