import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { PhysicianAddComponent } from './physician-add.component';
import { CustomHttpService } from '../core/custom-http.service';
import { PhysicianService } from './physician.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PhysicianProcedureCodeModel } from './models/physicianProcedureCodeModel';

@Component({
  selector: 'physician-procedureCode',
  templateUrl: 'physician-procedureCode.component.html'
})

export class PhysicianProcedureCodeComponent implements OnInit {

  //#region "property declaration"
  physicianProcedureForm: FormGroup;
  providerId: number;
  procedureCodeForAdd: any;
  procedureCodeForRemove: any;
  ischeck: boolean;
  ischecked: boolean;
  ProcedureCodeModel: PhysicianProcedureCodeModel = new PhysicianProcedureCodeModel();
  procedureCode = [];
  procedureCollection = [];
  //#endregion

  //#region "constructor"
  constructor(private router: Router, public dialog: MatDialog, private customHttpSvc: CustomHttpService, private physicianSvc: PhysicianService,
    private fb: FormBuilder, private activeroute: ActivatedRoute) { }
  //#endregion

  //#region "ngOnInit"
  ngOnInit() {
    this.activeroute.params.subscribe(param => {
      this.providerId = parseInt(param['ProviderId']);
    });
    this.physicianProcedureForm = this.fb.group({
      ProcedureCodeAdd: [],
      ProcedureCodeRemove: []
    });
    this.customHttpSvc.getDbName('Global_Master');
    this.bindProcedureCodeAdd();
    this.bindProcedureCodeRemove();
    this.bindProcedureAdd();
    this.bindProcedureRemove();
  }
    //#endregion

  //#region "Procedure Add (Value Change)"
  bindProcedureCodeAdd() {
    this.physicianProcedureForm.get('ProcedureCodeAdd').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.physicianSvc.getAllTreatmentCodes(key, this.providerId).then(data => {
              this.procedureCodeForAdd = data;
            });
          }
        }       
      });
  }
   //#endregion

  //#region "Procedure Add (onload value)"
  bindProcedureAdd() {
    this.physicianSvc.getAllTreatmentCodes("", this.providerId).then(data => {
      this.procedureCodeForAdd = data;
    });
  }
  //#endregion

  //#region "Procedure Remove (Value Change)"
  bindProcedureCodeRemove() {
    this.physicianProcedureForm.get('ProcedureCodeRemove').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.physicianSvc.getCPTCodesforProvider(key, this.providerId).then(data => {
              this.procedureCodeForRemove = data;
            });
          }
        }
      });
  }
    //#endregion

  //#region "Procedure Remove (onload value)"
  bindProcedureRemove() {
    this.physicianSvc.getCPTCodesforProvider("", this.providerId).then(data => {
      this.procedureCodeForRemove = data;
    });
  }
  //#endregion

  //#region "Add ProcedureCode change"
  addProcedureCode(element: any, data: any) {
    if (element.checked == true) {
       this.procedureCode.push(data);
      
    }
    else {
      this.procedureCode.splice(this.procedureCode.indexOf(data), 1);
    }
  }
   //#endregion

  //#region "addProcedureCode"
  addProcedureCodeCollections(status: any) {
    if (status == 'Add') {
      this.procedureCollection = [];
      for (let i = 0; i < this.procedureCode.length; i++) {
        this.ProcedureCodeModel = new PhysicianProcedureCodeModel();
        this.ProcedureCodeModel.ProviderTreatmentCodeID = 0;
        this.ProcedureCodeModel.ProviderID = this.providerId;
        this.ProcedureCodeModel.codeStatus = 'Add';
        this.ProcedureCodeModel.TreatmentCodeID = this.procedureCode[i].TreatmentCodeID;
        this.ProcedureCodeModel.CPTCode = this.procedureCode[i].CPTCode;
        this.procedureCollection.push(this.ProcedureCodeModel);
      }
    } else {
      this.procedureCollection = [];
      for (let i = 0; i < this.procedureCode.length; i++) {
        this.ProcedureCodeModel = new PhysicianProcedureCodeModel();
        this.ProcedureCodeModel.ProviderTreatmentCodeID = this.procedureCode[i].ProviderTreatmentCodeID;
        this.ProcedureCodeModel.ProviderID = this.providerId;
        this.ProcedureCodeModel.codeStatus = 'Remove';
        this.ProcedureCodeModel.TreatmentCodeID = this.procedureCode[i].TreatmentCodeID;
        this.ProcedureCodeModel.CPTCode = this.procedureCode[i].CPTCode;
        this.procedureCollection.push(this.ProcedureCodeModel);
      }
    }
    this.physicianSvc.addUpdateProcedureCodes(this.procedureCollection).then(data => {
      if (this.physicianProcedureForm.get('ProcedureCodeAdd').value == null && this.physicianProcedureForm.get('ProcedureCodeRemove').value == null ) {
        this.physicianSvc.getAllTreatmentCodes("", this.providerId).then(data => {
          this.procedureCodeForAdd = data;
        });
        this.physicianSvc.getCPTCodesforProvider("", this.providerId).then(data => {
          this.procedureCodeForRemove = data;
        });
      }
      else if (this.physicianProcedureForm.get('ProcedureCodeAdd').value && this.physicianProcedureForm.get('ProcedureCodeRemove').value) {
        this.physicianSvc.getAllTreatmentCodes(this.physicianProcedureForm.get('ProcedureCodeAdd').value, this.providerId).then(data => {
          this.procedureCodeForAdd = data;

        });
        this.physicianSvc.getCPTCodesforProvider(this.physicianProcedureForm.get('ProcedureCodeRemove').value, this.providerId).then(res => {
          this.procedureCodeForRemove = res;
        });
      }
     
      else if (this.physicianProcedureForm.get('ProcedureCodeRemove').value) {
        this.physicianSvc.getCPTCodesforProvider(this.physicianProcedureForm.get('ProcedureCodeRemove').value, this.providerId).then(res => {
          this.procedureCodeForRemove = res;
        });
        this.physicianSvc.getAllTreatmentCodes("", this.providerId).then(data => {
          this.procedureCodeForAdd = data;
        });
      }
      else if (this.physicianProcedureForm.get('ProcedureCodeAdd').value) { 
        this.physicianSvc.getAllTreatmentCodes(this.physicianProcedureForm.get('ProcedureCodeAdd').value, this.providerId).then(data => {
          this.procedureCodeForAdd = data;
        });
        this.physicianSvc.getCPTCodesforProvider("", this.providerId).then(data => {
          this.procedureCodeForRemove = data;
        });
      }
    });

   this.procedureCode = [];
  }
  //#endregion

  //#region "clear Add"
  clearAdd() {
    if (this.ischeck == false) {
      this.ischeck = undefined;
    } else {
      this.ischeck = false;
    }
    this.physicianProcedureForm.get('ProcedureCodeAdd').reset();
    this.bindProcedureAdd();
  }
 //#endregion

  //#region "clear Remove"
  clearRemove() {
    if (this.ischecked == false) {
      this.ischecked = undefined;
    } else {
      this.ischecked = false;
    }
    this.physicianProcedureForm.get('ProcedureCodeRemove').reset();
    this.procedureCode = [];
    this.bindProcedureRemove();
  }
   //#endregion

 // //#region "back"
 // back() {
 //   this.router.navigate(['/home/physician/physicianlist']);
 // }
 ////#endregion
}
