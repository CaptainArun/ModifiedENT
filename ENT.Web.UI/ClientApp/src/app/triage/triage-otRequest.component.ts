import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SurgeryRequestModel } from './models/surgeryRequestModel';
import { TriageService } from './triage.service';
import { CustomHttpService } from '../core/custom-http.service';
import { VisitService } from '../visit/visit.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'triage-otRequest',
  templateUrl: 'triage-otRequest.component.html'
})

export class TriageOtRequestComponent implements OnInit {
  surgeryRequestForm: FormGroup;
  isSpecialPreToggle = false;
  isDietToggle = false;
  isOtherInsToggle = false;
  isOtherToggle = false;
  isAnesthesiaNotes = false;
  urgencyType: any;
  diagnosisCodes: any;
  CPTCodes: any;
  patientId:number;
  providerId: number;
  caseSheetData: any;

  surgeryRequestModel: SurgeryRequestModel = new SurgeryRequestModel();

  constructor(private dialogRef: MatDialogRef<TriageOtRequestComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private fb: FormBuilder, private triageSvc: TriageService,
    private customHttpSvc: CustomHttpService, private visitSvc: VisitService, private activeRoute: ActivatedRoute) {
    this.caseSheetData = data;
    
  }
  ngOnInit() {

    this.surgeryRequestForm = this.fb.group({      
      DiagnosisICD10:[''],
      SurgerydiagnosisNotes: [''],
      CPTCode: [''],
      ProcedureNotes: [''],
      UrgencyID: [''],
      RequestedDate: [''],
      Time: [''],
      RegularMedication: [''],
      ApproximateDuration: [''],
      KnownAllergies: [''],
      Anesthesiafitnessrequired: [''],
      BloodRequired: [''],
      SpecialPreparation: [''],
      SpecialPreparationNotes: [''],
      DietInstructions: [''],
      DietInstructionsNotes: [''],
      OtherInstructions: [''],
      OtherInstructionsNotes: [''],
      Cardiac: [''],
      Mephology: [''],
      Nerology: [''],
      Urology: [''],
      Others: [''],
      OthersNotes: [''],
      Anesthesiafitnessnotes: ['']
    });
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getUrgencyType();
    this.bindDiagnosisCode();
    this.bindTreatmentCode();
  }
 
  anesthesiaFitnessToggle(event: any) {
    if (event.value == 1) {
      this.isAnesthesiaNotes = true;
    } else {
      this.isAnesthesiaNotes = false;
    }
  }
  changeSplPreToggle(event: any) {
    if (event.checked) {
      this.isSpecialPreToggle = true;
    } else {
      this.isSpecialPreToggle = false;
    }
  }
  changeDietToggle(event: any) {
    if (event.checked) {
      this.isDietToggle = true;
    } else {
      this.isDietToggle = false;
    }
  }
  changeOthersInsToggle(event:any) {
    if (event.checked) {
      this.isOtherInsToggle = true;
    } else {
      this.isOtherInsToggle = false;
    }
  }
    changeOthersToggle(event:any){
    if (event.checked) {
      this.isOtherToggle = true;
    } else {
      this.isOtherToggle = false;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getUrgencyType() {
    this.visitSvc.getUrgencyType().then(data => {
      this.urgencyType = data;
      
    });
  }

  diagCodeCollection: Array<any> = [];
  procedureCollection: Array<any> = [];
  bindDiagnosisCode() {
    if (this.surgeryRequestForm.get('DiagnosisICD10').value != null) {
      this.surgeryRequestForm.get('DiagnosisICD10').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageSvc.getAllDiagnosisCodes(key).then(data => {
                this.diagnosisCodes = data;
              });
            }
          }
        });
    }
  }

  getDiagnosisnames(event: any, item: any, input: any) {
    if (event.isUserInput == true) {
      this.diagCodeCollection.push(item);
      input.value = "";
    }
  }

  removeDiagnosisTag(user: any) {
    this.diagCodeCollection.splice(this.diagCodeCollection.indexOf(user), 1);
  }

  bindTreatmentCode() {
    if (this.surgeryRequestForm.get('CPTCode').value != null) {
      this.surgeryRequestForm.get('CPTCode').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageSvc.getAllTreatmentCodes(key).then(data => {
                this.CPTCodes = data;
              });
            }
          }
        });
    }
  }

  getProcedurenames(event: any, item: any, input: any) {
    if (event.isUserInput == true) {
      this.procedureCollection.push(item);
      input.value = "";
    }
  }

  removeProcedureTag(user: any) {
    this.procedureCollection.splice(this.procedureCollection.indexOf(user), 1);
  }
  ICDTemp = [];
  CPTTemp = [];
  addSurgeryFormRequest() {
    this.surgeryRequestModel = this.surgeryRequestForm.value;
    this.surgeryRequestModel.SurgicalRequestId = 0;
    this.surgeryRequestModel.VisitID = this.caseSheetData.VisitId;
    this.surgeryRequestModel.CaseSheetID = this.caseSheetData.CaseSheetId;
    this.surgeryRequestModel.ChiefComplaint = this.caseSheetData.diagnosisModel.ChiefComplaint;

    this.ICDTemp = [];
    
    for (let i = 0; i < this.diagCodeCollection.length; i++) {
      this.ICDTemp.push(this.diagCodeCollection[i].DiagnosisCodeID);
      
    }

    this.CPTTemp = [];
    
    for (let i = 0; i < this.procedureCollection.length; i++) {
      this.CPTTemp.push(this.procedureCollection[i].TreatmentCodeID);
      
    }
    this.surgeryRequestModel.DiagnosisICD10 = this.ICDTemp.toString();
    this.surgeryRequestModel.CPTCode = this.CPTTemp.toString(); 
    if (this.surgeryRequestForm.get('RegularMedication').value == 1) {
      this.surgeryRequestModel.Continuealltheregularmedication = true;
      this.surgeryRequestModel.Stopalltheregularmedication = false;
    } else {
      this.surgeryRequestModel.Continuealltheregularmedication = false;
      this.surgeryRequestModel.Stopalltheregularmedication = true;
    }
   
    this.triageSvc.addUpdateSurgeryRequest(this.surgeryRequestModel).then(data => data);
    this.surgeryRequestForm.reset();
  }
  dialogClose() {
    this.dialogRef.close();
  }
}
