import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { ConsultationTypeAddComponent } from './consultation-type-add/consultation-type-add.component';

@Component({
  selector: 'app-consultation-type',
  templateUrl: './consultation-type.component.html',
  styleUrls: ['./consultation-type.component.css']
})
export class ConsultationTypeComponent implements OnInit {
    // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    consultationTypeGrid: any;
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
        { PropertyName: "ConsultationTypeCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width:"15%" },
        { PropertyName: "ConsultationTypeDescription", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width:"60%" },
        { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width:"15%" }       
      ];
    }
  // #endregion

  // #region "ngOnInit"  
    ngOnInit() {
      this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
      this.getConsultationTypeGridData();
    }
  // #endregion

  // #region "get data for grid"  
    getConsultationTypeGridData() {
      this.configurationService.getConsultationTypeList().then(res => {
        this.consultationTypeGrid = res;
      });
    }
  // #endregion

  // #region "add new data to Table"
    addNewConsultationType() {
      const newConsultationType = this.dialog.open(ConsultationTypeAddComponent, {
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newConsultationType.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getConsultationTypeGridData();
        }
      });
    }
  // #endregion 

  // #region "Edit/Update Data of Table"
    editConsultationType(element: any) {
      this.configurationService.getConsultationTypebyId(element.Item.ConsultationTypeId).then(res => {
        var editRecordforConsultationType = res;
        let editDetailsofConsultationType = this.dialog.open(ConsultationTypeAddComponent, {
          data: editRecordforConsultationType,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofConsultationType.afterClosed().subscribe(result => {
          if (result == "Updated") {
            this.getConsultationTypeGridData();
          }
        });
      });
    }
  // #endregion  

  // #region "delete"
    deleteConsultationType(element: any) {
      this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
        if (res == true) {
          this.configurationService.deleteConsultationTypeRecord(element.Item.ConsultationTypeId).then(res => {
            this.getConsultationTypeGridData();
          });
        }
      });
    }
  // #endregion 

}