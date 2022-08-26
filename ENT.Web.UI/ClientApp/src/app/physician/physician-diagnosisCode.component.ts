import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { PhysicianAddComponent } from './physician-add.component';
import { PhysicianScheduleComponent } from './physician-schedule.component';
import { CustomHttpService } from '../core/custom-http.service';
import { PhysicianService } from './physician.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PhysicianDiagnosisCodeModel } from './models/physicianDiagnosisCodeModel';

@Component({
  selector: 'physician-diagnosisCode',
  templateUrl: 'physician-diagnosisCode.component.html'
})

export class PhysicianDiagnosisCodeComponent implements OnInit {

  //#region "property declaration"
  physicianDiagnosisForm: FormGroup;
  providerId: number;
  diagCodeForAdd: any;
  diagCodeForRemove: any;
  diagnosisCode = [];
  diagnosisCollection = [];
  ischeck: boolean;
  ischecked: boolean;
  diagnosisCodeModel: PhysicianDiagnosisCodeModel = new PhysicianDiagnosisCodeModel();
  //#endregion

  //#region "constructor"
  constructor(private router: Router, public dialog: MatDialog, private customHttpSvc: CustomHttpService,
    private activeroute: ActivatedRoute, private physicianSvc: PhysicianService, private fb: FormBuilder) { }
  //#endregion

  //#region "ngOnInit"
  ngOnInit() {
    this.activeroute.params.subscribe(param => {
      this.providerId = parseInt(param['ProviderId']);
    });
    this.physicianDiagnosisForm = this.fb.group({
      DiagnosisCodeAdd: [],
      DiagnosisCodeRemove: []
    });
    this.customHttpSvc.getDbName('Global_Master');
    this.bindDiagnosisCodeForAdd();
    this.bindDiagnosisCodeForRemove();
    this.bindDiagnosisAdd();
    this.bindDiagnosisRemove();
  }
  //#endregion

  //#region "Diagnosis Add (value Change)"
  bindDiagnosisCodeForAdd() {
      this.physicianDiagnosisForm.get('DiagnosisCodeAdd').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.physicianSvc.getAllDiagnosisCodes(key, this.providerId).then(data => {
                this.diagCodeForAdd = data;
              });
            }
          }
        });
  }
  //#endregion

   //#region "Diagnosis Add (onload value)"
  bindDiagnosisAdd() {
    this.physicianSvc.getAllDiagnosisCodes("", this.providerId).then(data => {
      this.diagCodeForAdd = data;
    });
  }
  //#endregion

  //#region "Diagnosis Remove (value Change)"
  bindDiagnosisCodeForRemove() {

      this.physicianDiagnosisForm.get('DiagnosisCodeRemove').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.physicianSvc.getICDCodesforProvider(key, this.providerId).then(data => {
                this.diagCodeForRemove = data;
              });
            }
          }
        });
  }
   //#endregion

  //#region "Diagnosis Remove (onload value)"
  bindDiagnosisRemove() {
    this.physicianSvc.getICDCodesforProvider("", this.providerId).then(data => {
      this.diagCodeForRemove = data;
    });
  }
   //#endregion

  //#region "Add Diagnosis change"
  addDiagnosisCode(element: any, data: any) {
    if (element.checked == true) {
        this.diagnosisCode.push(data);
      
    } else {
      this.diagnosisCode.splice(this.diagnosisCode.indexOf(data), 1);
    }
  }
  //#endregion

  //#region "addDaignosisCode"
  addDaignosisCodeCollections(status: any) {
    if (status == 'Add') {
      this.diagnosisCollection = [];
      for (let i = 0; i < this.diagnosisCode.length; i++) {
        this.diagnosisCodeModel = new PhysicianDiagnosisCodeModel();
        this.diagnosisCodeModel.ProviderDiagnosisCodeID = 0;
        this.diagnosisCodeModel.ProviderID = this.providerId;
        this.diagnosisCodeModel.codeStatus = 'Add';
        this.diagnosisCodeModel.DiagnosisCodeID = this.diagnosisCode[i].DiagnosisCodeID;
        this.diagnosisCodeModel.ICDCode = this.diagnosisCode[i].ICDCode;
        this.diagnosisCollection.push(this.diagnosisCodeModel);
      }
    } else {
      this.diagnosisCollection = [];
      for (let i = 0; i < this.diagnosisCode.length; i++) {
        this.diagnosisCodeModel = new PhysicianDiagnosisCodeModel();
        this.diagnosisCodeModel.ProviderDiagnosisCodeID = this.diagnosisCode[i].ProviderDiagnosisCodeID;
        this.diagnosisCodeModel.ProviderID = this.providerId;
        this.diagnosisCodeModel.codeStatus = 'Remove';
        this.diagnosisCodeModel.DiagnosisCodeID = this.diagnosisCode[i].DiagnosisCodeID;
        this.diagnosisCodeModel.ICDCode = this.diagnosisCode[i].ICDCode;
        this.diagnosisCollection.push(this.diagnosisCodeModel);
      }
    }
    this.physicianSvc.addUpdateDiagnosisCodes(this.diagnosisCollection).then(res => {
      if (this.physicianDiagnosisForm.get('DiagnosisCodeRemove').value == null && this.physicianDiagnosisForm.get('DiagnosisCodeAdd').value == null) {
        this.physicianSvc.getAllDiagnosisCodes("", this.providerId).then(data => {
          this.diagCodeForAdd = data;
        });
        this.physicianSvc.getICDCodesforProvider("", this.providerId).then(data => {
          this.diagCodeForRemove = data;
        });
      }
      else if (this.physicianDiagnosisForm.get('DiagnosisCodeAdd').value && this.physicianDiagnosisForm.get('DiagnosisCodeRemove').value) {
        this.physicianSvc.getAllDiagnosisCodes(this.physicianDiagnosisForm.get('DiagnosisCodeAdd').value, this.providerId).then(data => {
          this.diagCodeForAdd = data;
        });
      this.physicianSvc.getICDCodesforProvider(this.physicianDiagnosisForm.get('DiagnosisCodeRemove').value, this.providerId).then(data => {
        this.diagCodeForRemove = data;
      });
    }
      else if (this.physicianDiagnosisForm.get('DiagnosisCodeAdd').value) {
        this.physicianSvc.getAllDiagnosisCodes(this.physicianDiagnosisForm.get('DiagnosisCodeAdd').value, this.providerId).then(data => {
          this.diagCodeForAdd = data;
        });
        this.physicianSvc.getICDCodesforProvider("", this.providerId).then(data => {
          this.diagCodeForRemove = data;
        });
      }
      else if (this.physicianDiagnosisForm.get('DiagnosisCodeRemove').value) {
        this.physicianSvc.getICDCodesforProvider(this.physicianDiagnosisForm.get('DiagnosisCodeRemove').value, this.providerId).then(data => {
          this.diagCodeForRemove = data;
        });
        this.physicianSvc.getAllDiagnosisCodes("", this.providerId).then(data => {
          this.diagCodeForAdd = data;
        });
        }
      this.diagnosisCode = [];    
      });    
  }
  //#endregion

  ////#region "back"
  //back() {
  //  this.router.navigate(['/home/physician/physicianlist']);
  //}
  // //#endregion

  //#region "clear Add Diagnosis"
  clearAddDiagnosis() {
    if (this.ischeck == false) {
      this.ischeck = undefined;
    } else {
      this.ischeck = false;
    }

    this.physicianDiagnosisForm.get('DiagnosisCodeAdd').reset();
    this.bindDiagnosisAdd();
  }
   //#endregion

  //#region "clear remove Diagnosis"
  clearRemoveDiagnosis() {
    if (this.ischecked == false) {
      this.ischecked = undefined;
    } else {
      this.ischecked = false;
    }
    this.physicianDiagnosisForm.get('DiagnosisCodeRemove').reset();
    this.diagnosisCode = [];
    this.bindDiagnosisRemove();
  }
  //#endregion

}
