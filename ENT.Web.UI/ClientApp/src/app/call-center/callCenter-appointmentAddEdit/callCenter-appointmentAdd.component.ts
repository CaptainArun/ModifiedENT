import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilService } from "src/app/core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";
import { AppointmentEditRecordComponent } from "../../appointments/appointment-edit-record/appointment-editRecord.component";
import { CallCenterPopupHistoryComponent } from '../callCenter-popupHistory/callCenter-popupHistory.component';
import { CallCenterService } from '../callCenter.service';
import { CallCenterModel } from '../models/callCenterModel';

@Component({
  selector: 'callCenter-appointmentAdd',
  templateUrl: './callCenter-appointmentAdd.component.html'
})

export class CallCenterAppointmentAddComponent implements OnInit {

  //#region "Property Decelaration"
  appointmentAddForm: FormGroup;
  callCenterModel: CallCenterModel = new CallCenterModel();
  appointmentStatus: any;
  AppointmentIDResultData: any;
  hideHistoryReschudule: boolean=true;
  //#endregion

  //#region "constructor"
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CallCenterAppointmentAddComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
    private callCenterSvc: CallCenterService, private util: UtilService) { }
  //#endregion

  //#region "ngOnInit"

  ngOnInit() {
    this.hideHistoryReschudule=(this.data.AppointmentID) ? true : false;
    this.appointmentAddForm = this.fb.group({
      NumberCalled: ['', Validators.required],
      CallAnswered: ['', Validators.required],
      CallStatus: [''],
      AppointmentsStatus: ['', Validators.required],
      MessageDelivered: ['', Validators.required],
      AdditionalInformation: [''],
      Reminders: [''],
      ReminderType: [''],
      ReminderBefore: [''],
      Hours: [''],
      IntervalBetweenMessages: ['']
    });
    //this.getAppointmentStatus();
    if (this.data){
      //(this.data.AppointmentID)?this.data.AppointmentID : this.data.ProcedureRequestId;
      if(this.data.AppointmentID){
        this.callCenterSvc.getCallCenterAppointmentById(this.data.AppointmentID).then(dataValue => {
          this.AppointmentIDResultData = dataValue;
          this.AppointmentIDResultData ? this.getCallCenterAppointmentById() : this.appointmentAddForm.get('AppointmentsStatus').setValue(this.data.Appointmentstatus);
        });
      }
    else{
      this.callCenterSvc.getCallCenterProcedureRequestId(this.data.ProcedureRequestId).then(dataValue => {
        this.AppointmentIDResultData = dataValue;
        this.AppointmentIDResultData ? this.getCallCenterAppointmentById() : this.appointmentAddForm.get('AppointmentsStatus').setValue(this.data.AdmissionStatusDesc);
      });
    }
  }    
  }

  //#endregion

  // //#region "getAppointmentStatus"
  // getAppointmentStatus() {
  //   this.callCenterSvc.getAppointmentStatusForCallCenter().then(data => {
  //     this.appointmentStatus = data;
  //   });
  // }

  // //#endregion

  //#region "getCallCenterAppointmentById"

  getCallCenterAppointmentById() {
    if (this.AppointmentIDResultData) {
      this.callCenterModel.CallCenterId = this.AppointmentIDResultData.CallCenterId;
      this.callCenterModel.PatientId = this.AppointmentIDResultData.PatientId;
      this.callCenterModel.AppointmentID = this.AppointmentIDResultData.AppointmentID;
      this.appointmentAddForm.get('NumberCalled').setValue(this.AppointmentIDResultData.NumberCalled);
      this.appointmentAddForm.get('CallStatus').setValue(this.AppointmentIDResultData.CallStatus);
      this.appointmentAddForm.get('AppointmentsStatus').setValue(this.AppointmentIDResultData.AppProcStatus);
      this.appointmentAddForm.get('MessageDelivered').setValue(this.AppointmentIDResultData.MessagePassed);
      this.appointmentAddForm.get('AdditionalInformation').setValue(this.AppointmentIDResultData.AdditionalInformation);
      this.appointmentAddForm.get('CallAnswered').setValue(this.AppointmentIDResultData.WhomAnswered);
    }
  }
  //#endregion

  //#region "clear"
  clear() {
    (this.AppointmentIDResultData != null && this.AppointmentIDResultData != "" && this.AppointmentIDResultData != undefined) ? this.getCallCenterAppointmentById() : (this.appointmentAddForm.reset());
    (this.data.AppointmentID)?(this.appointmentAddForm.get('AppointmentsStatus').setValue(this.data.Appointmentstatus) ):(this.appointmentAddForm.get('AppointmentsStatus').setValue(this.data.AdmissionStatusDesc))
  }
  //#endregion

  //#region "dialogClose"
  dialogClose() {
    this.dialogRef.close();
  }
  //#endregion

  //#region "CallCenterRescheduled"
  CallCenterRescheduled() {

    this.callCenterSvc.getCCAppointmentReschuduleById(this.data.AppointmentID).then(res => {
      let data = res;
      data.componentName = "CallCenterAppointmentAdd";
      const dialogRef = this.dialog.open(AppointmentEditRecordComponent, {
        data: data,
        height: 'auto',
        width: '2000px',
        autoFocus: false,    
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "Updated") {
          // this.dialogRef.close("Updated");
        }
      });
      
    });

  }
  //#endregion

  //#region "openHistory"

  openHistory() {
    const dialogRef = this.dialog.open(CallCenterPopupHistoryComponent, {
      data: this.data.PatientID,
      height: 'auto',
      width: 'auto',
      autoFocus: false
    });

  }
  //#endregion

  //#region "CallCenterAppointmentSubmit"

  CallCenterAppointmentSubmit() {
    if (this.appointmentAddForm.valid) {
      this.callCenterModel.CallCenterId = this.callCenterModel.CallCenterId > 0 ? this.callCenterModel.CallCenterId : 0;
      this.callCenterModel.PatientId = (this.data.PatientID)?this.data.PatientID:this.data.PatientId;
      (this.data.AppointmentID) ? ((this.callCenterModel.AppointmentID = this.data.AppointmentID) && (this.callCenterModel.ProcedureReqID = 0)):((this.callCenterModel.ProcedureReqID = this.data.ProcedureRequestId ) && (this.callCenterModel.AppointmentID =0));
      this.callCenterModel.NumberCalled = this.appointmentAddForm.get('NumberCalled').value;
      this.callCenterModel.CallStatus = this.appointmentAddForm.get('CallStatus').value;
      this.callCenterModel.MessagePassed = this.appointmentAddForm.get('MessageDelivered').value;
      this.callCenterModel.AdditionalInformation = this.appointmentAddForm.get('AdditionalInformation').value;
      this.callCenterModel.WhomAnswered = this.appointmentAddForm.get('CallAnswered').value;
      this.callCenterModel.AppProcStatus =this.appointmentAddForm.get('AppointmentsStatus').value;      
      this.callCenterSvc.addUpdateCallCenterData(this.callCenterModel).then(res => {
        if(this.data.AppointmentID){
          this.util.showMessage('', 'CallCenter Appointment details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
            this.dialogRef.close("Updated");
        
        });       
       }else{
        this.util.showMessage('', 'CallCenter Procudure Surgery details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
          this.dialogRef.close("Updated");
      });  
       }

      });
    }
  }
  //#endregion

}
