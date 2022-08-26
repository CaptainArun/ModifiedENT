import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { AddAppointmentType } from '../appointment-type/add-appointment-type/add-appointment-type.component';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";
import { CustomHttpService } from '../../../core/custom-http.service';

@Component({
  selector: "app-appointment-type",
  styleUrls: ["./appointment-type.component.css"],
  templateUrl: './appointment-type.component.html'
})

export class Appointmenttype implements OnInit {
  tableConfig: TableConfig = new TableConfig;
  appointmentgrid: any;
  constructor(private config: UtilService, public MatDialog: MatDialog, public configurationservice: ConfigurationService, public CustHttp: CustomHttpService,) {

    this.tableConfig.showPagination = false;
    this.tableConfig.showView = false;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;
    this.tableConfig.showOpen = false;
    this.tableConfig.columnConfig = [
      { PropertyName: 'AppointmentTypeCode', DisplayName: ' Code', DisplayMode: 'Text', LinkUrl: '', width: "15%", },
      { PropertyName: 'AppointmentTypeDescription', DisplayName: ' Description', DisplayMode: 'Text', LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order No', DisplayMode: 'Text', LinkUrl: '', width: "15%",},
   
    ];
  }
  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getAppointmentstatusGridData();
  }
  getAppointmentstatusGridData() {
    this.configurationservice.Appointmentgrid().then((res) => {
      this.appointmentgrid = res;
    }
    );
  }
  addNewAppointment() {
    const newAppointment = this.MatDialog.open(AddAppointmentType, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newAppointment.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getAppointmentstatusGridData();
      }
    });
  }
  //#region "EditDrinking"

  editAppointment(element: any) {
    this.configurationservice.Appointmenteditgrid(element.Item.AppointmentTypeId)
      .then((res) => {
        var editDrinking = res;
        let editDetailsofDrinking = this.MatDialog.open(AddAppointmentType, {
          data: editDrinking,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofDrinking.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getAppointmentstatusGridData();
          }
        });
      });
  }
  //#endregion

  //#region "deleteDrinking"
  deleteAppointment(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.DeleteAppointment(element.Item.AppointmentTypeId).then((res) => {
            this.getAppointmentstatusGridData();
          });
        }
      });
  }
  //#endregion

}
