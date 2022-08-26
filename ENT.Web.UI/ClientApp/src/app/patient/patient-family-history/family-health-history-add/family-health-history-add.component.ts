import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PatientFamilyHistoryModel } from '../../models/PatientFamilyHistoryModel';
import { NewPatientService } from '../../newPatient.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteTrigger } from '@angular/material';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-family-health-history-add',
  templateUrl: './family-health-history-add.component.html',
  styleUrls: ['./family-health-history-add.component.css']
})
export class FamilyHealthHistoryAddComponent implements OnInit {

  PatientFamilyHistoryForm: FormGroup;
  PatientFamilyHistoryModel: PatientFamilyHistoryModel = new PatientFamilyHistoryModel();
  patientId: number = 0;
  icd: string;
  facilityId: number = 0;
  recordby: any;
  data: any[] = [];
  visitDateTime: any[] = [];
  //identification: any;
  recordedDuring: any = '';
  visitID: number;
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  familyhistory: any;
  illnesstype: any;
  patientRelations: any;
  icdtooltip: any;
  @ViewChild('autoCompleteIcd', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;

  constructor(public fb: FormBuilder, public patfamser: NewPatientService, public custHttp: CustomHttpService,
    public dialog: MatDialog, public DialogRef: MatDialogRef<FamilyHealthHistoryAddComponent>, @Inject(MAT_DIALOG_DATA) public data1: any, private util: UtilService) { }
  
    ngOnInit() {
    this.PatientFamilyHistoryForm = this.fb.group({
      ICDCode: [''],
      RecordedDate: [new Date(), Validators.required],
      RecordedBy: ['', Validators.required],
      FamilyMemberName: ['', Validators.required],
      Relationship: ['', Validators.required],
      DiagnosisNotes: ['', Validators.required],
      IllnessType: ['', Validators.required],
      ProblemStatus: ['', Validators.required],
      PhysicianName: [''],
      AdditionalNotes: [''],
      Createddate: [''],
      CreatedBy: [''],
      ModifiedDate: [''],
      ModifiedBy: [''],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      VisitDateandTime: ['', Validators.required],
      recordedDuring: ['']
    });
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getDateTime();
    this.getICDcode();
    this.getProviderName();
     this.getIllnesstype();
     this.getAllRelationForPatient();
     this.getFamilyHistoryStatusMasters();
   }

  ngAfterViewInit() {
    this.trigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.PatientFamilyHistoryForm.get('ICDCode').setValue('');
        }
      });
  }
   getAllRelationForPatient() {
    this.patfamser.getAllRelationship().then(res => {
      this.patientRelations = res;
    });
  }
  //illnesstype
 
  getIllnesstype() {
    this.patfamser.getIllnesstype().then(res => {
      this.illnesstype = res;
    })
  }

  getFamilyHistoryStatusMasters() {
    this.patfamser.getfamilyhistory().then(res => {
      this.familyhistory = res;

    })
  }
  //DateWithTime
sendDateWithTime() {
 this.getDate = new Date(this.PatientFamilyHistoryForm.get("RecordedDate").value);
    if (this.PatientFamilyHistoryForm.get("RecordedDate").value != "") {
      if (this.PatientFamilyHistoryForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.PatientFamilyHistoryForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.PatientFamilyHistoryForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.PatientFamilyHistoryForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.PatientFamilyHistoryForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.PatientFamilyHistoryForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.PatientFamilyHistoryForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate
}
  //Submit
  addUpdate() {
    if (this.PatientFamilyHistoryForm.valid) {

    this.sendDateWithTime();
   this.PatientFamilyHistoryModel.FamilyHealthHistoryID 
    this.PatientFamilyHistoryModel.VisitID = this.visitID; 
    this.PatientFamilyHistoryModel.ICDCode = this.PatientFamilyHistoryForm.get('ICDCode').value;
    this.PatientFamilyHistoryModel.RecordedDate = this.getDateAndTime;
    this.PatientFamilyHistoryModel.RecordedBy = this.PatientFamilyHistoryForm.get('RecordedBy').value;
    this.PatientFamilyHistoryModel.FamilyMemberName = this.PatientFamilyHistoryForm.get('FamilyMemberName').value;
    //this.PatientFamilyHistoryModel.FamilyMemberAge = 5; 
    this.PatientFamilyHistoryModel.Relationship = this.PatientFamilyHistoryForm.get('Relationship').value;
    this.PatientFamilyHistoryModel.DiagnosisNotes = this.PatientFamilyHistoryForm.get('DiagnosisNotes').value;
    this.PatientFamilyHistoryModel.IllnessType = this.PatientFamilyHistoryForm.get('IllnessType').value;
    this.PatientFamilyHistoryModel.ProblemStatus = this.PatientFamilyHistoryForm.get('ProblemStatus').value;
    this.PatientFamilyHistoryModel.PhysicianName = this.PatientFamilyHistoryForm.get('PhysicianName').value;
    this.PatientFamilyHistoryModel.AdditionalNotes = this.PatientFamilyHistoryForm.get('AdditionalNotes').value;
    this.PatientFamilyHistoryModel.visitDateandTime = this.PatientFamilyHistoryForm.get('VisitDateandTime').value;
    this.PatientFamilyHistoryModel.recordedDuring = this.PatientFamilyHistoryForm.get('recordedDuring').value;
    this.patfamser.addUpdateFamilyHealthHistory(this.PatientFamilyHistoryModel).then(data => {
      this.util.showMessage('', 'Family History details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => { }
      );
      this.DialogRef.close("Update");
   })
  }
      }


  //DateTime
  getDateTime() {
    this.patfamser.GetVisitsForPatient(this.patfamser.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitDateTime[i] = res[i].VisitDateandTime;        
      }
    })
  }
  //RecordedDuring
 RecordedDuring(index: any) {   
    this.patfamser.GetVisitsForPatient(this.patfamser.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
          this.visitID = data[i].VisitId;
          this.PatientFamilyHistoryForm.get("recordedDuring").setValue(this.recordedDuring);

        }
      }
    })
  }
 //ICDCode
  getICDcode() {
    this.PatientFamilyHistoryForm.get('ICDCode').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.patfamser.GetICDCodesbySearch(key).then(data => {
              this.icd = data;
             
            })
           
          }
          else {
            this.icd = null;
            this.icdtooltip = null;
          }
        }
     
      })
  }
  //recordby
  getProviderName() {
    this.patfamser.GetProviderNames(this.facilityId).then(res => {
      this.recordby = res;
         })
  }
  //cancelForm
  cancelForm() {
    this.PatientFamilyHistoryForm.reset();
    this.PatientFamilyHistoryForm.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
  this.recordedDuring = "";
  }
  //Close
  dialogClose(): void {
    this.DialogRef.close();
  }
  //seticd
  setIcdCode(value1, value2) {
    this.icdtooltip = value1 + " " + value2;
  }
}
