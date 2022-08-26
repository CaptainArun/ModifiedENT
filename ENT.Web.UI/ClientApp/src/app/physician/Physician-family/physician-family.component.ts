import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PhysicianContactInfoModel } from '../models/physicianContactInfoModel';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { PhysicianFamilyDetailsModel } from '../models/physicianFamilyDetailsModel';

@Component({
  selector: 'app-PhysicianFamilyComponent',
  templateUrl: './physician-family.component.html',
  styleUrls: ['./physician-family.component.css']
})
export class PhysicianFamilyComponent implements OnInit {
  //#region "Property Decleration"
  form: FormGroup;
  familyDetailsModel: PhysicianFamilyDetailsModel = new PhysicianFamilyDetailsModel();
   //#endregion
  //#region "Constructor"
  constructor(public fb: FormBuilder, private util: UtilService, public dialogRef: MatDialogRef<PhysicianFamilyComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder,) {
  }
  //#endregion
  //#region "ngOnInit"
  ngOnInit() {
    this.form = this._formBuilder.group({
      ProviderFamilyDetailId: [''],
      ProviderID: [''],
      FullName: ['', Validators.required],
      Age: ['', Validators.required],
      RelationShip: ['', Validators.required],
      Occupation: [''],
      Notes: ['']
    });
    this.getdata();
  }
  //#endregion
  //#region "Get data"
  getdata() {
    this.form.get('FullName').setValue(this.data.FullName);
    this.form.get('Age').setValue(this.data.Age);
    this.form.get('RelationShip').setValue(this.data.RelationShip);
    this.form.get('Occupation').setValue(this.data.RelationShip);
    this.form.get('Notes').setValue(this.data.Notes);
  }
    //#endregion
  //#region "dialogClose"
  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion
  //#region "Submit"
    submit() {
    if (this.form.valid) {
      this.familyDetailsModel = new PhysicianFamilyDetailsModel();
      this.familyDetailsModel.FullName = this.form.get('FullName').value;
      this.familyDetailsModel.Age = this.form.get('Age').value;
      this.familyDetailsModel.RelationShip = this.form.get('RelationShip').value;
      this.familyDetailsModel.Occupation = this.form.get('Occupation').value;
      this.familyDetailsModel.Notes = this.form.get('Notes').value;
      this.util.showMessage('', 'Physician Family details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => {
          this.dialogRef.close(this.familyDetailsModel);
        }
      );
    }
  }

 //#endregion
  //#region "Clear"
  clear() {
    this.form.reset();
    this.getdata();
  }
    //#endregion
}
