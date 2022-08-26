import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteTrigger } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PatientFamilyHistoryModel } from '../../models/PatientFamilyHistoryModel';
import { NewPatientService } from '../../newPatient.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-family-health-history-edit',
  templateUrl: './family-health-history-edit.component.html',
  styleUrls: ['./family-health-history-edit.component.css']
})
export class FamilyHealthHistoryEditComponent implements OnInit {
  familyHealthHistoryEditForm: FormGroup;
  familyHealthHistoryEditModel: PatientFamilyHistoryModel = new PatientFamilyHistoryModel();
 facilityID: number=0;
  recordby: any[] = [];
  icd: string;
  patientId: number = 0;
  recordedDuring: any = '';
  visitID: any;
  familyhistory: any;
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  visitDateTime: any[] = [];
  patientRelations: any;
  illnesstype: any;
  icdtooltip: any;
  @ViewChild('autoCompleteIcd', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
 constructor(public fb: FormBuilder, public editser: NewPatientService, public dialogRef: MatDialogRef<FamilyHealthHistoryEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any ,private util: UtilService) {
     }
 ngOnInit() {
    this.familyHealthHistoryEditForm = this.fb.group({
     FamilyHealthHistoryID: [''],
      VisitID: [''],
      ICDCode: [''],
      RecordedDate: ['', Validators.required],
      RecordedBy: ['', Validators.required],
      FamilyMemberName: ['', Validators.required],
      FamilyMemberAge: ['', Validators.required],
      Relationship: ['', Validators.required],
      DiagnosisNotes: ['', Validators.required],
      IllnessType: ['', Validators.required],
      ProblemStatus: ['', Validators.required],
      PhysicianName: [''],
      AdditionalNotes: [''],
       RecordedTime: ['', Validators.required],
      visitDateandTime: ['', Validators.required],
      recordedDuring: ['']
    });
    this.setFamilyHealthHistory();
    this.getICDcode();
    this.getProviderName();
    this.getDateTime();
   this.getIllnesstype();
   this.getFamilyHistoryStatusMasters();
   this.getAllRelationForPatient();
   this.familyHealthHistoryEditForm.get('visitDateandTime').disable();
   this.familyHealthHistoryEditForm.get('recordedDuring').disable();

  }
  ngAfterViewInit() {
    this.trigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.familyHealthHistoryEditForm.get('ICDCode').setValue('');
        }
      });
  }
  getAllRelationForPatient() {
    this.editser.getAllRelationship().then(res => {
      this.patientRelations = res;
    });
  }
  getFamilyHistoryStatusMasters() {
    this.editser.getfamilyhistory().then(res => {
      this.familyhistory = res;

    })
  }
  //illnesstype
 
  getIllnesstype() {
    this.editser.getIllnesstype().then(res => {
      this.illnesstype = res;
    })
  }
  sendDateWithTime() {

    this.getDate = new Date(this.familyHealthHistoryEditForm.get("RecordedDate").value);

    if (this.familyHealthHistoryEditForm.get("RecordedDate").value != "") {
      if (this.familyHealthHistoryEditForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.familyHealthHistoryEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.familyHealthHistoryEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.familyHealthHistoryEditForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.familyHealthHistoryEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.familyHealthHistoryEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.familyHealthHistoryEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate

  }

  //Set data
  setFamilyHealthHistory() {
    this.familyHealthHistoryEditForm.get('FamilyHealthHistoryID').setValue(this.data1.FamilyHealthHistoryID);
    this.familyHealthHistoryEditForm.get('VisitID').setValue(this.data1.VisitID);
    this.familyHealthHistoryEditForm.get('ICDCode').setValue(this.data1.ICDCode);
    this.familyHealthHistoryEditForm.get('RecordedDate').setValue(new Date(this.data1.RecordedDate));
    this.familyHealthHistoryEditForm.get('RecordedTime').setValue(new Date(this.data1.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.familyHealthHistoryEditForm.get('FamilyMemberName').setValue(this.data1.FamilyMemberName);
    this.familyHealthHistoryEditForm.get('FamilyMemberAge').setValue(this.data1.FamilyMemberAge);
    //this.familyHealthHistoryEditForm.get('Relationship').setValue(parseInt(this.data1.Relationship));
    this.familyHealthHistoryEditForm.get('Relationship').setValue(this.data1.Relationship);
    this.familyHealthHistoryEditForm.get('DiagnosisNotes').setValue(this.data1.DiagnosisNotes);
    this.familyHealthHistoryEditForm.get('IllnessType').setValue(this.data1.IllnessType);
    this.familyHealthHistoryEditForm.get('ProblemStatus').setValue(this.data1.ProblemStatus);
    this.familyHealthHistoryEditForm.get('PhysicianName').setValue(this.data1.PhysicianName);
    this.familyHealthHistoryEditForm.get('AdditionalNotes').setValue(this.data1.AdditionalNotes);
    this.familyHealthHistoryEditForm.get('RecordedBy').setValue(this.data1.RecordedBy);
    this.familyHealthHistoryEditForm.get('visitDateandTime').setValue(this.data1.visitDateandTime);
    this.familyHealthHistoryEditForm.get('recordedDuring').setValue(this.data1.recordedDuring);
    this.icdtooltip = this.data1.ICDCode;
  }
  //Submit
  updateFamilyHealthHistory() {
    this.sendDateWithTime();
    this.familyHealthHistoryEditModel.FamilyHealthHistoryID = this.data1.FamilyHealthHistoryID;
    this.familyHealthHistoryEditModel.VisitID = this.data1.VisitID;
    this.familyHealthHistoryEditModel.ICDCode = this.familyHealthHistoryEditForm.get('ICDCode').value;
    this.familyHealthHistoryEditModel.RecordedDate = this.getDateAndTime;
    this.familyHealthHistoryEditModel.RecordedBy = this.familyHealthHistoryEditForm.get('RecordedBy').value;
    this.familyHealthHistoryEditModel.FamilyMemberName = this.familyHealthHistoryEditForm.get('FamilyMemberName').value;
    //this.familyHealthHistoryEditModel.FamilyMemberAge = this.data1.FamilyMemberAge;
    this.familyHealthHistoryEditModel.Relationship = this.familyHealthHistoryEditForm.get('Relationship').value;
    this.familyHealthHistoryEditModel.DiagnosisNotes = this.familyHealthHistoryEditForm.get('DiagnosisNotes').value;
    this.familyHealthHistoryEditModel.IllnessType = this.familyHealthHistoryEditForm.get('IllnessType').value;
    this.familyHealthHistoryEditModel.ProblemStatus = this.familyHealthHistoryEditForm.get('ProblemStatus').value;
    this.familyHealthHistoryEditModel.PhysicianName = this.familyHealthHistoryEditForm.get('PhysicianName').value;
    this.familyHealthHistoryEditModel.AdditionalNotes = this.familyHealthHistoryEditForm.get('AdditionalNotes').value;
    this.familyHealthHistoryEditModel.RecordedTime = this.familyHealthHistoryEditForm.get('RecordedTime').value;
    this.familyHealthHistoryEditModel.visitDateandTime = this.familyHealthHistoryEditForm.get('visitDateandTime').value;
    this.familyHealthHistoryEditModel.recordedDuring = this.familyHealthHistoryEditForm.get('recordedDuring').value;
    this.editser.addUpdateFamilyHealthHistory(this.familyHealthHistoryEditModel).then(data => {
      this.util.showMessage('', 'Family History details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => { }
      );
      this.dialogRef.close("Update");
    })
  }
  //recordby
 getProviderName() {
    this.editser.GetProviderNames(this.facilityID).then(res => {
      this.recordby = res;
          })
  }
  //ICDCode
 getICDcode() {
    this.familyHealthHistoryEditForm.get('ICDCode').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.editser.GetICDCodesbySearch(key).then(data => {
              this.icd = data;

            })
          } else {
            this.icd = null;
            this.icdtooltip = null;
          }
        }
      })
  }
  //RecordedDuring
  RecordedDuring(index: any) {
    this.editser.GetVisitsForPatient(this.editser.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
        }
      }
    })
  }
  //Date Time
  getDateTime() {
    this.editser.GetVisitsForPatient(this.editser.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitDateTime[i] = res[i].VisitDateandTime;
        this.visitID = res[i].VisitId;
      }
    })
  }
  //Cancel
  cancelForm() {
    this.familyHealthHistoryEditForm.reset();
    this.setFamilyHealthHistory();
  }
//Close
  dialogClose(): void {
    this.dialogRef.close();
  }
  //setIcdCode
  setIcdCode(value1,value2) {
    this.icdtooltip = value1 + " " + value2;
  }
}
