import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PatientSocialHistoryModel } from '../../../triage/models/patientSocialHistoryModel';
import { NewPatientService } from '../../newPatient.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VisitService } from '../../../visit/visit.service';
import { TriageService } from '../../../triage/triage.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-patient-social-history-edit',
  templateUrl: './patient-social-history-edit.component.html',
  styleUrls: ['./patient-social-history-edit.component.css']
})
export class PatientSocialHistoryEditComponent implements OnInit {
   //#region "Property Decleration"
  visitIntakeForm: FormGroup;
/*  tableConfig: TableConfig = new TableConfig();
*/  patientId: number = 1;
  visitId: number;
  //patientById = [];
  //patientvisitHistoryList: any;
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
  smokingData: string;
  DrinkingData: string;
  smoking: any;
  drinking: any;
    //#endregion

//#region "constructor"
  constructor(private newPatientSvc: NewPatientService, private router: Router, private _formBuilder: FormBuilder, public dialog: MatDialog,
    private visitSvc: VisitService, private triageSvc: TriageService, private activeRoute: ActivatedRoute,
    private customHttpSvc: CustomHttpService, public dialogRef: MatDialogRef<PatientSocialHistoryEditComponent>, @Inject(MAT_DIALOG_DATA) public data1: any, private util: UtilService) {
  
}
      //#endregion

 //#region "ngOnInit"
    ngOnInit() {
      this.visitIntakeForm = this._formBuilder.group({
        PatientId: [''],
        VisitId: [''],
        SocialHistoryId: [''],
        RecordedDate: ['', Validators.required],
        RecordedBy: ['', Validators.required],
        recordedDuring: ['', Validators.required],
        RecordedTime: ['', Validators.required],
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
      this.smokingstatus();
      this.DrinkingStatus();
      this.setSocialHistory();
      this.getDrinking();
      this.getSmoking();
      this.visitIntakeForm.get('VisitDateandTime').disable();
      this.visitIntakeForm.get('recordedDuring').disable();

  }
    //#endregion

   //#region "getSmoking"
  getSmoking() {
    this.triageSvc.getsmoking().then(res => {
      this.smoking = res;
    

    })
  }
    //#endregion

 //#region "getDrinking"
  getDrinking() {
    this.triageSvc.getdrinking().then(res => {
      this.drinking = res;
    

    })
  }
   //#endregion
  //#region " getVisit"
  getVisitForPatient() {
    this.newPatientSvc.GetVisitsForPatient(this.newPatientSvc.patientId).then(res => {
        for (var i = 0; i < res.length; i++) {
          this.visitdate[i] = res[i].VisitDateandTime;
          this.visitID = res[i].VisitId;
        

        }
      })

    }
    //#endregion
  //#region " getRecordedDuring"
    RecordedDuring(index: any) {

      this.triageSvc.getVisitForPatient(this.newPatientSvc.patientId).then(data => {
        for (var i = 0; i < data.length; i++) {
          if (i == index) {
            this.recordedDuring = data[i].recordedDuring;
            this.visitID = data[i].VisitId;
     
          }
        }
      })
    }
   //#endregion
  //#region " recordby"
    getProviderNames() {
      this.triageSvc.getProviderNames(this.facilityId).then(res => {
        this.recordby = res;

      })
    }
     //#endregion
  //#region " recordby"
  smokingstatus() {
    if (this.data1.Smoking == 1) {
      this.smokingData = "Yes";
    }
    if (this.data1.Smoking == 2) {
      this.smokingData = "No";
    }
    if (this.data1.Smoking == 3) {
      this.smokingData = "Ocassional"
    }
  }
       //#endregion
  //#region " DrinkingStatus"
  DrinkingStatus() {
    if (this.data1.Drinking == 1) {
      this.DrinkingData = "Yes";
    }
    if (this.data1.Drinking == 2) {
      this.DrinkingData = "No";
    }
    if (this.data1.Drinking == 3) {
      this.DrinkingData = "Occasional";
    }
  }
         //#endregion
  //#region " setSocialHistory"

  setSocialHistory() {
    this.visitIntakeForm.get('RecordedDate').setValue(new Date(this.data1.RecordedDate));
    this.visitIntakeForm.get('RecordedTime').setValue(new Date(this.data1.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.visitIntakeForm.get('RecordedBy').setValue(this.data1.RecordedBy);
    this.visitIntakeForm.get('VisitDateandTime').setValue(this.data1.visitDateandTime);
    this.visitIntakeForm.get('recordedDuring').setValue(this.data1.recordedDuring);
    this.visitIntakeForm.get('Smoking').setValue(this.data1.Smoking);
    this.visitIntakeForm.get('CigarettesPerDay').setValue(this.data1.CigarettesPerDay);
    this.visitIntakeForm.get('Drinking').setValue(this.data1.Drinking);
    this.visitIntakeForm.get('ConsumptionPerDay').setValue(this.data1.ConsumptionPerDay);
    this.visitIntakeForm.get('DrugHabitsDetails').setValue(this.data1.DrugHabitsDetails);
    this.visitIntakeForm.get('LifeStyleDetails').setValue(this.data1.LifeStyleDetails);
    this.visitIntakeForm.get('CountriesVisited').setValue(this.data1.CountriesVisited);
    this.visitIntakeForm.get('DailyActivities').setValue(this.data1.DailyActivities);
    this.visitIntakeForm.get('AdditionalNotes').setValue(this.data1.AdditionalNotes);
  }
           //#endregion
  //#region " Send Date"
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
  addUpdateSocialHist() {

    this.sendDateWithTime();

    this.socialHistoryModel.VisitId = this.data1.VisitId;
    this.socialHistoryModel.PatientId = this.newPatientSvc.patientId;
   // this.socialHistoryModel.SocialHistoryId = this.data1.SocialHistoryId;
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
    this.triageSvc.addUpdateSocialHistoryForVisit(this.socialHistoryModel).then(data => {
      this.util.showMessage('', 'Social History details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => { }
      );
      this.dialogRef.close("update");

    })
  }
               //#endregion
    //#region "Update"

  cancelForm() {
    this.visitIntakeForm.reset();
    this.setSocialHistory();
  }
                 //#endregion
    //#region "Close"
  dialogClose() {
    this.dialogRef.close();
  }
                   //#endregion

  }


