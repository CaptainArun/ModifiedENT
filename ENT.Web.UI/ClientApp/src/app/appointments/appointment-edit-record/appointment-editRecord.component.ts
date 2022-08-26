import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppointmentModel } from '../models/appointmentModel';
import { AppointmentsService } from '../appointments.service';
import { NewPatientService } from '../../patient/newPatient.service';
import { DatePipe } from '@angular/common';
import { AvailabilityModel } from '../models/availabilityModel';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { CallCenterService } from '../../call-center/callCenter.service';

@Component({
  selector: 'appointment-editRecord',
  templateUrl: 'appointment-editRecord.component.html',
  styleUrls: ['./appointment-editRecord.component.css']
})

export class AppointmentEditRecordComponent {

  appointmentEditForm: FormGroup;
  appointmentData: any;
  providerName: any;
  appointmentModel: AppointmentModel = new AppointmentModel();
  availabilityModel: AvailabilityModel = new AvailabilityModel();
  cancelData: any = true;
  facilityID: number = 0;
  orderPhysician: any;
  availabilityStatus: any;
  availableTime: any[] = [];
  AppointmentTime: any;

  constructor(public dialogRef: MatDialogRef<AppointmentEditRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, private appointmentSvc: AppointmentsService, private callCenterSvc: CallCenterService, public newPatsvc: NewPatientService, public datepipe: DatePipe, private util: UtilService) {
  }

  minDate = new Date(this.data.AppointmentDate);
  ngOnInit() {
    this.appointmentEditForm = this.fb.group({
      PatientName: ['',],
      AppointmentDate: ['', Validators.required],
      AppointmentTime: ['', Validators.required],
      ToConsult: [''],
      Reason: [''],
      PhysicianName: ['']
    });
    this.appointmentEditForm.get('ToConsult').disable();
    this.appointmentEditForm.get('PhysicianName').disable();

    this.setPatientAppointmentDetail();
    this.bindProviders();
    this.cancelRecord();
    this.getOrderingPhysician();
    //this.getTimeDuration();
  }

  bindProviders() {
    this.appointmentSvc.getProvidersforAppointments().then(data => {
      this.providerName = data;
    });
  }

  getTimeDuration() {

    this.availabilityModel.FacilityId = this.data.FacilityID;
    this.availabilityModel.ProviderId = this.data.ProviderID;
    this.availabilityModel.AppointDate = this.appointmentEditForm.get('AppointmentDate').value;
    var appDate = this.datepipe.transform(this.appointmentEditForm.get('AppointmentDate').value, 'yyyy-MM-dd, hh:mm:ss a');
    if (this.availabilityModel.AppointDate != undefined) {
      this.appointmentSvc.availabilityStatus(this.availabilityModel).then(data => {
        this.availabilityStatus = data.availability;
        if (this.availabilityStatus == 'No Schedules for this Provider') {
          this.availableTime = null
          this.appointmentEditForm.controls.AppointmentDate.reset();

          this.util.showMessage('', 'No Schedules for this Provider', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then(
            (res) => { }
          );

        }

        else if (this.availabilityStatus == 'No Schedule available on this Day for this Provider') {
          this.availableTime = null
          this.appointmentEditForm.controls.AppointmentDate.reset();
          this.appointmentEditForm.controls.AppointmentTime.reset();
          this.util.showMessage('', 'No Schedule available on this Day for this Provider', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then(
            (res) => { }
          );
          this.cancelForm();
        }

        else if (this.availabilityStatus == 'Provider is on Vacation, Not Available') {
          this.availableTime = null
          this.appointmentEditForm.controls.AppointmentDate.reset();
          this.util.showMessage('', 'Provider is on Vacation, Not Available', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then(
            (res) => { }
          );
          this.cancelForm();
        }

        else if (this.availabilityStatus == 'Yes, Available') {

          this.appointmentSvc.getTimingsforAppointment(appDate, this.data.ProviderID,this.availabilityModel.FacilityId).then(data => {
            this.availableTime = data;

            this.availableTime.unshift({ IsAvailable: true, ScheduleTime: this.data.AppointmentTime, duration: this.data.duration });
            this.appointmentEditForm.get('AppointmentTime').setValue(this.data.AppointmentTime);

          });


        }
      });
    }
  }

  setPatientAppointmentDetail() {
    this.appointmentEditForm.get('PatientName').setValue(this.data.PatientName);
    this.appointmentEditForm.get('AppointmentDate').setValue(this.data.AppointmentDate);
    //this.getTimeDuration();
    this.appointmentEditForm.get('AppointmentTime').setValue(this.data.AppointmentTime);
    this.availableTime = [{ ScheduleTime: this.data.AppointmentTime }];
    this.appointmentEditForm.get('ToConsult').setValue(this.data.ToConsult);
    this.appointmentEditForm.get('Reason').setValue(this.data.Reason);
    this.appointmentEditForm.get('PhysicianName').setValue(this.data.ProviderName);
    //this.AppointmentTime = this.data.AppointmentTime
  }

  getOrderingPhysician() {
    this.appointmentEditForm.get('PhysicianName').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.newPatsvc.GetProviderNames(this.facilityID).then(data => {
              this.orderPhysician = data;
            })
          }
        }
      })
  }

  updatePatientAppointmentDetails() {
    if (this.appointmentEditForm.valid) {

      this.appointmentModel.AppointmentID = this.data.AppointmentID;
      this.appointmentModel.PatientID = this.data.PatientID;
      this.appointmentModel.FacilityID = this.data.FacilityID;
      this.appointmentModel.ProviderID = this.data.ProviderID;
      this.appointmentModel.PatientName = this.appointmentEditForm.get('PatientName').value;

      var appointDate: Date;
      var appointTimeHH: number;
      var appointTimeMin: number;
      appointDate = new Date(this.appointmentEditForm.get('AppointmentDate').value);

      if (this.appointmentEditForm.get('AppointmentDate').value != "") {
        if (this.appointmentEditForm.get('AppointmentTime').value.toLowerCase().split(' ')[1] == "pm") {
          if (parseInt(this.appointmentEditForm.get('AppointmentTime').value.split(' ')[0].toString().split(':')[0]) == 12) {
            appointTimeHH = 12;
          }
          else {
            appointTimeHH = parseInt(this.appointmentEditForm.get('AppointmentTime').value.split(' ')[0].toString().split(':')[0]) + 12;
          }
        }

        else if (this.appointmentEditForm.get('AppointmentTime').value.toLowerCase().split(' ')[1] == "am") {
          if (parseInt(this.appointmentEditForm.get('AppointmentTime').value.split(' ')[0].toString().split(':')[0]) == 12) {
            appointTimeHH = 0;
          }
          else {
            appointTimeHH = parseInt(this.appointmentEditForm.get('AppointmentTime').value.split(' ')[0].toString().split(':')[0]);
          }
        }

        appointTimeMin = parseInt(this.appointmentEditForm.get('AppointmentTime').value.split(' ')[0].toString().split(':')[1]);
        appointDate.setHours(appointTimeHH, appointTimeMin, 0, 0);
      }

      this.appointmentModel.AppointmentDate = appointDate; //this.appointmentEditForm.get('AppointmentDate').value;
      //this.appointmentModel.AppointmentTime = this.appointmentEditForm.get('AppointmentTime').value;
      this.appointmentModel.ToConsult = this.appointmentEditForm.get('ToConsult').value;
      this.appointmentModel.Reason = this.appointmentEditForm.get('Reason').value;

      this.appointmentModel.AppointmentTypeID = this.data.AppointmentTypeID;
      this.appointmentModel.AppointmentStatusID = this.data.AppointmentStatusID;
      //this.appointmentModel.Reason = this.data.Reason;

      this.appointmentModel.CPTCode = this.data.CPTCode;
      this.appointmentModel.AddToWaitList = this.data.AddToWaitList;
      this.appointmentModel.IsRecurrence = false;
      this.appointmentModel.RecurrenceId = this.data.RecurrenceId;
      if (this.data.componentName == "CallCenterAppointmentAdd") {
        this.callCenterSvc.addAppointmentReschudule(this.appointmentModel).then(data => {
          this.util.showMessage('', 'Appointment details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
            this.dialogRef.close("Updated");
          }
          );
        });
      }
      else {
        this.appointmentSvc.addAppointment(this.appointmentModel).then(data => {
          this.util.showMessage('', 'Appointment details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
            this.dialogRef.close("Updated");
          }
          );
        });
      }
    }
  }



  cancelRecord() {
    if (this.data.Appointmentstatus == "Cancelled") {
      this.cancelData = false;
    }


  }


  cancelForm() {
    this.setPatientAppointmentDetail();
  }

  dialogClose(): void {
    this.dialogRef.close();
  }
}
