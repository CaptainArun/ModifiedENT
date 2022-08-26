import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { AppointmentAddComponent } from './appointment-add/appointment-add.component';

@Component({
    selector: 'app-appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    appointmentGrid: any;
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
        { PropertyName: "AppointmentBookedCode", DisplayName: "Code", DisplayMode: "Text", LinkUrl: "", width:"15%" },
        { PropertyName: "AppointmentBookedDescription", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width:"60%" },
        { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width:"15%" }       
      ];
    }
  // #endregion

  // #region "ngOnInit"  
    ngOnInit() {
      this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
      this.getAppointmentGridData();
    }
  // #endregion

  // #region "get data for grid"  
    getAppointmentGridData() {
      this.configurationService.getAppointmentList().then(res => {
        this.appointmentGrid = res;
      });
    }
  // #endregion

  // #region "add new data to Table"
    addNewAppointment() {
      const newAppointment = this.dialog.open(AppointmentAddComponent, {
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newAppointment.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getAppointmentGridData();
        }
      });
    }
  // #endregion 

  // #region "Edit/Update Data of Table"
    editAppointment(element: any) {
      this.configurationService.getAppointmentbyId(element.Item.AppointmentBookedId).then(res => {
        var editRecordforAppointment = res;
        let editDetailsofAppointment = this.dialog.open(AppointmentAddComponent, {
          data: editRecordforAppointment,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofAppointment.afterClosed().subscribe(result => {
          if (result == "Updated") {
            this.getAppointmentGridData();
          }
        });
      });
    }
  // #endregion  

  // #region "delete"
    deleteAppointment(element: any) {
      this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res: any) => {
        if (res == true) {
          this.configurationService.deleteAppointmentRecord(element.Item.AppointmentBookedId).then(res => {
            this.getAppointmentGridData();
          });
        }
      });
    }
  // #endregion 
 
}