import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PatientSocialHistoryModel } from '../../../triage/models/patientSocialHistoryModel';
import { NewPatientService } from '../../newPatient.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { VisitService } from '../../../visit/visit.service';
import { TriageService } from '../../../triage/triage.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { PatientFuntionAddComponent } from '../../patient-function/patient-funtion-add/patient-funtion-add.component';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';


@Component({
  selector: 'app-patient-social-history-add',
  templateUrl: './patient-social-history-add.component.html',
  styleUrls: ['./patient-social-history-add.component.css']
})
export class PatientSocialHistoryAddComponent implements OnInit {
  //#region "Property Decleration"
  visitIntakeForm: FormGroup;
/*  tableConfig: TableConfig = new TableConfig();
*/  patientId: number=1;
  visitId: number;
  //patientById = [];
  patientvisitHistoryList: any;
  visitIntake: any;
  recordedDuring: any = '';
  visitID: number;
  visitdate: any[] = [];
  facilityId: number = 0;
  recordby: any[] = [];
  //cpt: any;
  socialHistoryModel: PatientSocialHistoryModel = new PatientSocialHistoryModel();
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  smoking: any;
  drinking: any;
   //#endregion
  //#region "constructor"
  constructor(private newPatientSvc: NewPatientService, private router: Router, private _formBuilder: FormBuilder, public dialog: MatDialog,
    private visitSvc: VisitService, private triageSvc: TriageService, private activeRoute: ActivatedRoute,
    private customHttpSvc: CustomHttpService, public dialogRef: MatDialogRef<PatientFuntionAddComponent>, private util: UtilService) { }
    //#endregion
  //#region "ngOnInit"
  ngOnInit() {
    this.visitIntakeForm = this._formBuilder.group({
      PatientId: [''],
      VisitId: [''],
      SocialHistoryId: [''],
      RecordedDate: [new Date(), Validators.required],
      RecordedBy: ['', Validators.required],
      recordedDuring: ['', Validators.required],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      VisitDateandTime: ['', Validators.required],
      Smoking: ['', Validators.required],
      CigarettesPerDay: [''],
      Drinking: [''],
      ConsumptionPerDay: [''],
      DrugHabitsDetails: [''],
      LifeStyleDetails: [''],
      CountriesVisited: [''],
      DailyActivities: [''],
      AdditionalNotes: [''],
      // NoNewSocialHistory: [''],
    });

    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getVisitForPatient();
    this.getProviderNames();
    this.getDrinking();
    this.getSmoking();
  }
  //#endregion
  //#region "Visit"
  getVisitForPatient() {
    this.newPatientSvc.GetVisitsForPatient(this.newPatientSvc.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitdate[i] = res[i].VisitDateandTime;
        this.visitID = res[i].VisitId;
       
      }
    })

  }
    //#endregion
 //#region "RecordedDuring"
  RecordedDuring(index: any) {
   
    this.triageSvc.getVisitForPatient(this.newPatientSvc.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
          this.visitID = data[i].VisitId;
          this.visitIntakeForm.get("recordedDuring").setValue(this.recordedDuring);

        }
      }
    })
  }
      //#endregion
 //#region "Smoking"
  getSmoking() {
    this.triageSvc.getsmoking().then(res => {
      this.smoking = res;  
    })
  }
        //#endregion
 //#region "Drinking"
  getDrinking() {
    this.triageSvc.getdrinking().then(res => {
      this.drinking = res;

    })
  }
   //#endregion
 //#region "Record"
  getProviderNames() {
    this.triageSvc.getProviderNames(this.facilityId).then(res => {
      this.recordby = res;

    })
  }
     //#endregion
 //#region "Send Date"
  sendDateWithTime() {

    this.getDate = new Date(this.visitIntakeForm.get("RecordedDate").value);

    if (this.visitIntakeForm.get("RecordedDate").value != "") {
      if (this.visitIntakeForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.visitIntakeForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.visitIntakeForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.visitIntakeForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.visitIntakeForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.visitIntakeForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.visitIntakeForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate

  }
       //#endregion
 //#region "Update"
  addUpdateSocialHistory() {
    this.sendDateWithTime();
    if (this.visitIntakeForm.valid) {
      this.socialHistoryModel.PatientId = this.newPatientSvc.patientId;
      this.socialHistoryModel.VisitId = this.visitID;
      this.socialHistoryModel.SocialHistoryId = 0;
      this.socialHistoryModel.RecordedDate = this.getDateAndTime;
      this.socialHistoryModel.RecordedBy = this.visitIntakeForm.get('RecordedBy').value;
      this.socialHistoryModel.Smoking = this.visitIntakeForm.get('Smoking').value;
      this.socialHistoryModel.CigarettesPerDay = this.visitIntakeForm.get('CigarettesPerDay').value;
      this.socialHistoryModel.Drinking = this.visitIntakeForm.get('Drinking').value;
      this.socialHistoryModel.ConsumptionPerDay = this.visitIntakeForm.get('ConsumptionPerDay').value;
      this.socialHistoryModel.DrugHabitsDetails = this.visitIntakeForm.get('DrugHabitsDetails').value;
      this.socialHistoryModel.LifeStyleDetails = this.visitIntakeForm.get('LifeStyleDetails').value;
      this.socialHistoryModel.CountriesVisited = this.visitIntakeForm.get('CountriesVisited').value;
      this.socialHistoryModel.DailyActivities = this.visitIntakeForm.get('DailyActivities').value;
      this.socialHistoryModel.AdditionalNotes = this.visitIntakeForm.get('AdditionalNotes').value;
      this.triageSvc.addUpdateSocialHistoryForVisit(this.socialHistoryModel).then(res => {
        this.util.showMessage('', 'Social History details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          (res) => { }
          
        );
        this.dialogRef.close("update");
      });
    }
  }
         //#endregion
 //#region "Cancel"
  cancelForm() {
    this.visitIntakeForm.reset();
    this.visitIntakeForm.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required);
    this.recordedDuring = "";
  }
//#endregion
 //#region "Close"
  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion

}
