import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomHttpService } from 'src/app/core/custom-http.service';
import { TableConfig } from '../../ux/columnConfig';
import { CallCenterService } from '../callCenter.service';

@Component({
  selector: 'callCenter-popupHistory',
  templateUrl: 'callCenter-popupHistory.component.html'
})

export class CallCenterPopupHistoryComponent implements OnInit {

  //#region "Property Decelaration"
  public tableConfig: TableConfig = new TableConfig();
  particularPatientId: any;
  particularPatientHistorydata: any;
  particularHisCountData: any;
  //#endregion

  //#region "constructor"
  constructor(private customHttpSvc: CustomHttpService, private dialogRef: MatDialogRef<CallCenterPopupHistoryComponent>, @Inject(MAT_DIALOG_DATA) public data: number, private callCenterSvc: CallCenterService) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = false;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = false;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = false;
    this.tableConfig.columnConfig = [
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
      //{ PropertyName: 'PatientContactNumber', DisplayName: 'Patient Contact Number', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ProviderName', DisplayName: 'Appointment with', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'AppointmentDate', DisplayName: 'Appointment Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'AppointmentTime', DisplayName: 'Appointment Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Appointmentstatus', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Reason', DisplayName: 'Purpose', DisplayMode: 'Text', LinkUrl: '' }
    ];
  }
  //#endregion

  //#region "ngOnInit"
  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.data ? (this.particularPatientId = this.data) : null;
    this.getCCParticularHistoryCountData();
    this.getCCAppointmentParticularHistoryData();
  }
  //#endregion

  //#region "getCCParticularHistoryCountData"
  getCCParticularHistoryCountData() {
    this.callCenterSvc.getCCParticularHistoryCountData(this.particularPatientId).then(res => {
      this.particularHisCountData = res;
    });
  }
  //#endregion

  //#region "getCCAppointmentParticularHistoryData"
  getCCAppointmentParticularHistoryData() {
    this.callCenterSvc.getCCAppointmentHistoryById(this.particularPatientId).then(res => {
      this.particularPatientHistorydata = res;
    });
  }
  //#endregion

  //#region "dialogClose"
  dialogClose() {
    this.dialogRef.close();
  }
  //#endregion

}
