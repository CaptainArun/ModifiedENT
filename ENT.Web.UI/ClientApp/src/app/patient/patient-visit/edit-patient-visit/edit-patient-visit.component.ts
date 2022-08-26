import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PatientVisitModel } from '../../../visit/models/patientVisitModel';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VisitService } from '../../../visit/visit.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { NewPatientService } from '../../newPatient.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-edit-patient-visit',
  templateUrl: './edit-patient-visit.component.html',
  styleUrls: ['./edit-patient-visit.component.css']
})
export class EditPatientVisitComponent implements OnInit {

  patientVisitForm: FormGroup;
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
  OrderNumber: any = "";

  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder,
    private visitSvc: VisitService, private customHttpSvc: CustomHttpService, private newPatientSvc: NewPatientService,
    public activateRoute: ActivatedRoute, public dialogRef: MatDialogRef<EditPatientVisitComponent>, @Inject(MAT_DIALOG_DATA) public ParticularVisitData: any, private util: UtilService) {
  }

  newRegistration() {
    this.router.navigate(['home/patient']);

  }
 

  ngOnInit() {
  
    this.patientVisitForm = this.fb.group({

      VisitId: [''],
      PatientId: [''],
      VisitDate: [''],
      Visittime: [''],
      VisitTypeID: [''],
      VisitDateandTime: [''],
      RecordedDuringID: [''],
      UrgencyTypeID: [''],
      PatientArrivalConditionID: [''],
      FacilityID: [''],
      ToConsult: [''],
      ProviderID: [''],
      ReferringFacility: [''],
      ReferringProvider: [''],
      ConsultationType: [''],
      ChiefComplaint: [''],
      AccompaniedBy: [''],
      TransitionOfCarePatient: [''],
      TokenNumber: [''],
      Appointment: [''],
      VisitStatusID: [''],
      PatientNextConsultation: [''],
      AdditionalInformation: [''],
      SkipVisitIntake: ['']

    });
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getVisitType();
    this.setPatientRecord();
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
    this.visitSvc.getVisitsbyPatientID(this.ParticularVisitData.PatientId).then(data => {

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
  getDate: Date;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;


  sendDateWithTime() {

    this.getDate = new Date(this.patientVisitForm.get("VisitDate").value);

    if (this.patientVisitForm.get("VisitDate").value != "") {
      if (this.patientVisitForm.get("Visittime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.patientVisitForm.get("Visittime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.patientVisitForm.get("Visittime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.patientVisitForm.get("Visittime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.patientVisitForm.get("Visittime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.patientVisitForm.get("Visittime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.patientVisitForm.get("Visittime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }

  setPatientRecord() {

      if (this.ParticularVisitData.VisitTypeID == 2) {
        this.showfield = false;
      }
      else {
        this.showfield = true;
      }

      if (this.ParticularVisitData != undefined && this.ParticularVisitData != null) {
        this.patientVisitModel.VisitId = this.ParticularVisitData.VisitId;
        this.patientVisitModel.PatientId = this.ParticularVisitData.PatientId;
        this.patientVisitForm.get('VisitDateandTime').setValue(this.ParticularVisitData.VisitDateandTime);
        this.patientVisitForm.get('VisitDate').setValue(this.ParticularVisitData.VisitDate);
        this.patientVisitForm.get('Visittime').setValue(new Date(this.ParticularVisitData.VisitDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
        this.patientVisitForm.get('VisitTypeID').setValue(this.ParticularVisitData.VisitTypeID);
        this.patientVisitForm.get('RecordedDuringID').setValue(this.ParticularVisitData.RecordedDuringID);
        this.patientVisitForm.get('VisitDateandTime').setValue(this.ParticularVisitData.VisitDateandTime);
        this.patientVisitForm.get('UrgencyTypeID').setValue(this.ParticularVisitData.UrgencyTypeID);
        this.patientVisitForm.get('PatientArrivalConditionID').setValue(this.ParticularVisitData.PatientArrivalConditionID);
        this.patientVisitForm.get('FacilityID').setValue(this.ParticularVisitData.FacilityID);
        this.patientVisitForm.get('ToConsult').setValue(this.ParticularVisitData.ToConsult);
        this.patientVisitForm.get('ProviderID').setValue(this.ParticularVisitData.ProviderID);
        this.patientVisitForm.get('ReferringFacility').setValue(this.ParticularVisitData.ReferringFacility);
        this.patientVisitForm.get('ReferringProvider').setValue(this.ParticularVisitData.ReferringProvider);
        this.patientVisitForm.get('ConsultationType').setValue(this.ParticularVisitData.ConsultationType);
        this.patientVisitForm.get('ChiefComplaint').setValue(this.ParticularVisitData.ChiefComplaint);
        this.patientVisitForm.get('AccompaniedBy').setValue(this.ParticularVisitData.AccompaniedBy);
        this.patientVisitForm.get('TransitionOfCarePatient').setValue(this.ParticularVisitData.TransitionOfCarePatient);
        this.patientVisitForm.get('TokenNumber').setValue(this.ParticularVisitData.TokenNumber);
        this.patientVisitForm.get('Appointment').setValue(this.ParticularVisitData.Appointment);
        this.patientVisitForm.get('VisitStatusID').setValue(this.ParticularVisitData.VisitStatusID);
        this.patientVisitForm.get('PatientNextConsultation').setValue(this.ParticularVisitData.PatientNextConsultation);
        this.patientVisitForm.get('AdditionalInformation').setValue(this.ParticularVisitData.AdditionalInformation);
        this.patientVisitForm.get('SkipVisitIntake').setValue(this.ParticularVisitData.SkipVisitIntake);
        this.OrderNumber= this.ParticularVisitData.VisitNo;
        this.patientVisitModel.VisitReason = "";

      }
    }

    updatePatientVisitData() {
      if(this.patientVisitForm.valid){
      this.sendDateWithTime();
      this.patientVisitModel.VisitId = this.ParticularVisitData.VisitId;
      this.patientVisitModel.PatientId = this.ParticularVisitData.PatientId;
      this.patientVisitModel.VisitNo = this.ParticularVisitData.VisitNo;
      this.patientVisitModel.VisitDate = this.patientVisitForm.get('VisitDate').value;
      this.patientVisitModel.Visittime = this.patientVisitForm.get('Visittime').value;
      this.patientVisitModel.visitDateandTime = this.patientVisitForm.get('VisitDateandTime').value;
      this.patientVisitModel.VisitTypeID = this.patientVisitForm.get('VisitTypeID').value;
      this.patientVisitModel.RecordedDuringID = this.patientVisitForm.get('RecordedDuringID').value;
      this.patientVisitModel.UrgencyTypeID = this.patientVisitForm.get('UrgencyTypeID').value;
      this.patientVisitModel.PatientArrivalConditionID = this.patientVisitForm.get('PatientArrivalConditionID').value;
      this.patientVisitModel.FacilityID = this.patientVisitForm.get('FacilityID').value;
      this.patientVisitModel.ToConsult = this.patientVisitForm.get('ToConsult').value;
      this.patientVisitModel.ProviderID = this.patientVisitForm.get('ProviderID').value;
      this.patientVisitModel.ReferringFacility = this.patientVisitForm.get('ReferringFacility').value;
      this.patientVisitModel.ReferringProvider = this.patientVisitForm.get('ReferringProvider').value;
      this.patientVisitModel.ConsultationType = this.patientVisitForm.get('ConsultationType').value;
      this.patientVisitModel.ChiefComplaint = this.patientVisitForm.get('ChiefComplaint').value;
      this.patientVisitModel.AccompaniedBy = this.patientVisitForm.get('AccompaniedBy').value;
      this.patientVisitModel.TransitionOfCarePatient = this.patientVisitForm.get('TransitionOfCarePatient').value;
      this.patientVisitModel.TokenNumber = this.patientVisitForm.get('TokenNumber').value;
      this.patientVisitModel.Appointment = this.patientVisitForm.get('Appointment').value;
      this.patientVisitModel.VisitStatusID = this.patientVisitForm.get('VisitStatusID').value;
      this.patientVisitModel.PatientNextConsultation = this.patientVisitForm.get('PatientNextConsultation').value;
      this.patientVisitModel.AdditionalInformation = this.patientVisitForm.get('AdditionalInformation').value;
      this.patientVisitModel.SkipVisitIntake = this.patientVisitForm.get('SkipVisitIntake').value;
      this.patientVisitModel.VisitReason = "";

      this.visitSvc.addUpdateVisit(this.patientVisitModel).then(res => {
        this.util.showMessage('', 'Patient Visit details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
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
