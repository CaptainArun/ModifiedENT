import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilService } from '../../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../../ux/bmsmsgbox/bmsmsgbox.component';
import { ConfigurationService } from '../../../configuration.service';
import { AppointmentModel } from '../../../Models/appointmentModel';

@Component({
  selector: 'appointment-add',
  templateUrl: './appointment-add.component.html',
  styleUrls: ['./appointment-add.component.css']
})
export class AppointmentAddComponent implements OnInit {
  // #region "Property Declaration"
  addAppointmentForm: FormGroup;
  appointmentModel: AppointmentModel = new AppointmentModel();
  appointmentId: number = 0;
  showName: string = "Add";
  isReadOnly: boolean = false;
  // #endregion

  // #region "constructor"
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<AppointmentAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
  // #endregion

  // #region "ngOnInit"
  ngOnInit() {
    this.addAppointmentForm = this.fb.group({
      AppointmentCode: ["", Validators.required],
      AppointmentDescription: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setAppointmentData();

    if (this.data != null) {
      this.appointmentId = this.data.AppointmentBookedId;
      this.showName = "Edit";
      this.isReadOnly = true;
    }
  }
  // #endregion

  //#region "set Values For Form"
  setAppointmentData() {
    if (this.data) {
      this.addAppointmentForm.get('AppointmentCode').setValue(this.data.AppointmentBookedCode);
      this.addAppointmentForm.get('AppointmentDescription').setValue(this.data.AppointmentBookedDescription);
      this.addAppointmentForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  // #region "Save New Data"
  addEditAppointment() {
    if (this.addAppointmentForm.valid) {
      this.appointmentModel.AppointmentBookedId = this.appointmentId;
      this.appointmentModel.AppointmentBookedCode = this.addAppointmentForm.get("AppointmentCode").value;
      this.appointmentModel.AppointmentBookedDescription = this.addAppointmentForm.get("AppointmentDescription").value;
      this.appointmentModel.OrderNo = this.addAppointmentForm.get("OrderNo").value;

      this.configurationService.addUpdateAppointment(this.appointmentModel).then(res => {
        if (res) {
          this.util.showMessage("", "Appointment details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

          });
          this.dialogRef.close("Updated");
        }
      });
    }
  }
  // #endregion

  // #region "clear the Form values"
  clearForm() {
    this.addAppointmentForm.reset();
    this.setAppointmentData();
  }
  // #endregion

  // #region "To close the Pop up"
  dialogClose(): void {
    this.dialogRef.close();
  }
  // #endregion 

}