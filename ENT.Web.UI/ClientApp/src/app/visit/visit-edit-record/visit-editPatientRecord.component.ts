import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PatientVisitModel } from '../models/patientVisitModel';
import { VisitService } from '../visit.service';
import { CustomHttpService } from 'src/app/core/custom-http.service';
import { UtilService } from "../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: 'visit-editPatientRecord',
  templateUrl: 'visit-editPatientRecord.component.html',
  styleUrls: ['./visit-editPatientRecord.component.css']
})

export class VisitEditPatientRecordComponent implements OnInit {



  patientVisitEditForm: FormGroup;
  patientVisitModel: PatientVisitModel = new PatientVisitModel();
  visitType: any;
  urgencyType: any;
  patientArraivalCondition: any;
  hospitalName: any;
  toConsultData: any;
  visitStatus: any;
  recordedDuring: any;
  selected = 'option1';
  disableSelect = true;
  visitData: any;
  showfield: boolean = true;
  VisitDateandTimeType: any;
  ConsultationType: any;
  AppointmentType: any;
  getDate: Date;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  gettime: any;
  visitOrderNumber: any;
  
  constructor(public dialogRef: MatDialogRef<VisitEditPatientRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, private visitSvc: VisitService, private customHttpSvc: CustomHttpService, public dialog: MatDialog, private util: UtilService
  ) {

  }

  ngOnInit() {
    this.patientVisitEditForm = this.fb.group({
      VisitId: [''],
      PatientId: [''],
      VisitDate: [''],
      Visittime: [''],
      VisitTypeID: [''],
      VisitDateandTime: [''],
      RecordedDuringID: ['', Validators.required],
      UrgencyTypeID: ['', Validators.required],
      PatientArrivalConditionID: ['', Validators.required],
      FacilityID: [''],
      ToConsult: ['', Validators.required],
      ProviderID: ['', Validators.required],
      ReferringFacility: [''],
      ReferringProvider: [''],
      ConsultationType: ['', Validators.required],
      ChiefComplaint: [''],
      AccompaniedBy: [''],
      TransitionOfCarePatient: [''],
      TokenNumber: [''],
      Appointment: ['', Validators.required],
      VisitStatusID: ['', Validators.required],
      PatientNextConsultation: [''],
      AdditionalInformation: [''],
      SkipVisitIntake: ['']
    });
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.setPatientRecord();
    this.getVisitType();
    this.getAllRecordedDuring();
    this.getUrgencyType();
    this.getPatientArraivalCondition();
    this.getHospitalName();
    this.getToConsult();
    this.getVisitStatus();
    this.getVisitsbyPatientID();
    this.ConsultationTypesForVisit();
    this.AppointmentBookedListForVisit();
  }

  getVisitType() {
    this.visitSvc.getVisitType().then(data => {
      this.visitType = data;
    });
  }
  getAllRecordedDuring() {
    this.visitSvc.getAllRecordedDuringOptions().then(data => {
      this.recordedDuring = data;
    });
  }

  getUrgencyType() {
    this.visitSvc.getUrgencyType().then(data => {
      this.urgencyType = data;
    });
  }

  getPatientArraivalCondition() {
    this.visitSvc.getPatientArraivalCondition().then(data => {
      this.patientArraivalCondition = data;
    });
  }

  getHospitalName() {
    this.visitSvc.getHospital().then(data => {
      this.hospitalName = data;
    });
  }

  getToConsult() {
    this.visitSvc.getToConsult().then(data => {
      this.toConsultData = data;
    });
  }

  getVisitStatus() {
    this.visitSvc.getVisitStatus().then(data => {
      this.visitStatus = data;
    });
  }

  getVisitsbyPatientID() {
    this.visitSvc.getVisitsbyPatientID(this.data.PatientId).then(data => {
      if (data != undefined) {
        this.VisitDateandTimeType = data;
      }
    });
  }


  ConsultationTypesForVisit() {
    this.visitSvc.ConsultationTypesForVisit().then(data => {
      this.ConsultationType = data;
    }
    );
  }

  AppointmentBookedListForVisit() {
    this.visitSvc.AppointmentBookedListForVisit().then(data => {
      this.AppointmentType = data;
    })
  }
  showfield1(VisitTypeId) {
    if (VisitTypeId == 2) {
      this.showfield = false;
    }
    else {
      this.showfield = true;
    }
  }

  sendDateWithTime() {

    this.getDate = new Date(this.patientVisitEditForm.get("VisitDate").value);

    if (this.patientVisitEditForm.get("VisitDate").value != "") {
      if (this.patientVisitEditForm.get("Visittime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.patientVisitEditForm.get("Visittime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.patientVisitEditForm.get("Visittime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.patientVisitEditForm.get("Visittime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.patientVisitEditForm.get("Visittime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.patientVisitEditForm.get("Visittime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.patientVisitEditForm.get("Visittime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }

  setPatientRecord() {
    if (this.data.VisitTypeID == 2) {
      this.showfield = false;
    }
    else {
      this.showfield = true;
    }

    if (this.data != undefined && this.data != null) {

      this.patientVisitModel.VisitId = this.data.VisitId;
      this.patientVisitModel.PatientId = this.data.PatientId;
      this.visitOrderNumber=this.data.VisitNo;
      this.patientVisitEditForm.get('VisitDateandTime').setValue (this.data.VisitDateandTime);
      this.patientVisitEditForm.get('VisitDate').setValue(new Date(this.data.VisitDate).toLocaleDateString());
      this.patientVisitEditForm.get('Visittime').setValue(new Date(this.data.VisitDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
      this.patientVisitEditForm.get('VisitTypeID').setValue(this.data.VisitTypeID);
      this.patientVisitEditForm.get('RecordedDuringID').setValue(this.data.RecordedDuringID);
      this.patientVisitEditForm.get('VisitDateandTime').setValue(this.data.VisitDateandTime);
      this.patientVisitEditForm.get('UrgencyTypeID').setValue(this.data.UrgencyTypeID);
      this.patientVisitEditForm.get('PatientArrivalConditionID').setValue(this.data.PatientArrivalConditionID);
      this.patientVisitEditForm.get('FacilityID').setValue(this.data.FacilityID);
      this.patientVisitEditForm.get('ToConsult').setValue(this.data.ToConsult);
      this.patientVisitEditForm.get('ProviderID').setValue(this.data.ProviderID);
      this.patientVisitEditForm.get('ReferringFacility').setValue(this.data.ReferringFacility);
      this.patientVisitEditForm.get('ReferringProvider').setValue(this.data.ReferringProvider);
      this.patientVisitEditForm.get('ConsultationType').setValue(this.data.ConsultationType);
      this.patientVisitEditForm.get('ChiefComplaint').setValue(this.data.ChiefComplaint);
      this.patientVisitEditForm.get('AccompaniedBy').setValue(this.data.AccompaniedBy);
      this.patientVisitEditForm.get('TransitionOfCarePatient').setValue(this.data.TransitionOfCarePatient);
      this.patientVisitEditForm.get('TokenNumber').setValue(this.data.TokenNumber);
      this.patientVisitEditForm.get('Appointment').setValue(this.data.Appointment);
      this.patientVisitEditForm.get('VisitStatusID').setValue(this.data.VisitStatusID);
      this.patientVisitEditForm.get('PatientNextConsultation').setValue(this.data.PatientNextConsultation);
      this.patientVisitEditForm.get('AdditionalInformation').setValue(this.data.AdditionalInformation);
      this.patientVisitEditForm.get('SkipVisitIntake').setValue(this.data.SkipVisitIntake);
      this.patientVisitModel.VisitReason = "";
    }    
  }

  updatePatientVisitData() {
    if (this.patientVisitEditForm.valid) {
      this.sendDateWithTime();
      this.patientVisitModel.VisitId = this.data.VisitId;
      this.patientVisitModel.PatientId = this.data.PatientId;
      this.patientVisitModel.VisitDate = this.data.VisitDate;
      this.patientVisitModel.Visittime = this.patientVisitEditForm.get('Visittime').value;
      this.patientVisitModel.visitDateandTime = this.patientVisitEditForm.get('VisitDateandTime').value;
      this.patientVisitModel.VisitTypeID = this.patientVisitEditForm.get('VisitTypeID').value;
      this.patientVisitModel.RecordedDuringID = this.patientVisitEditForm.get('RecordedDuringID').value;
      this.patientVisitModel.UrgencyTypeID = this.patientVisitEditForm.get('UrgencyTypeID').value;
      this.patientVisitModel.PatientArrivalConditionID = this.patientVisitEditForm.get('PatientArrivalConditionID').value;
      this.patientVisitModel.FacilityID = this.data.FacilityID;
      this.patientVisitModel.ToConsult = this.patientVisitEditForm.get('ToConsult').value;
      this.patientVisitModel.ProviderID = this.patientVisitEditForm.get('ProviderID').value;
      this.patientVisitModel.ReferringFacility = this.patientVisitEditForm.get('ReferringFacility').value;
      this.patientVisitModel.ReferringProvider = this.patientVisitEditForm.get('ReferringProvider').value;
      this.patientVisitModel.ConsultationType = this.patientVisitEditForm.get('ConsultationType').value;
      this.patientVisitModel.ChiefComplaint = this.patientVisitEditForm.get('ChiefComplaint').value;
      this.patientVisitModel.AccompaniedBy = this.patientVisitEditForm.get('AccompaniedBy').value;
      this.patientVisitModel.TransitionOfCarePatient = this.patientVisitEditForm.get('TransitionOfCarePatient').value;
      this.patientVisitModel.TokenNumber = this.patientVisitEditForm.get('TokenNumber').value;
      this.patientVisitModel.Appointment = this.patientVisitEditForm.get('Appointment').value;
      this.patientVisitModel.VisitStatusID = this.patientVisitEditForm.get('VisitStatusID').value;
      this.patientVisitModel.PatientNextConsultation = this.patientVisitEditForm.get('PatientNextConsultation').value;
      this.patientVisitModel.AdditionalInformation = this.patientVisitEditForm.get('AdditionalInformation').value;
      this.patientVisitModel.SkipVisitIntake = this.patientVisitEditForm.get('SkipVisitIntake').value;
      this.patientVisitModel.VisitNo=this.visitOrderNumber;
      this.patientVisitModel.VisitReason = "";
      this.visitSvc.addUpdateVisit(this.patientVisitModel).then(data => {
        this.util.showMessage('', 'Visit details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          (res) => {
            
            if (res === true) {
              this.dialogRef.close();
            }
          }
        );

      });
    }
  }

  clear() {
    this.setPatientRecord();
  }

  close() {
    this.dialogRef.close();
  }
}

