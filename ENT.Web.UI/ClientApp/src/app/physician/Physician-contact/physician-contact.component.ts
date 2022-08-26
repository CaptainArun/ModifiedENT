import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PhysicianContactInfoModel } from '../models/physicianContactInfoModel';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-PhysicianContactComponent',
  templateUrl: './physician-contact.component.html',
  styleUrls: ['./physician-contact.component.css']
})
export class physicianContactDetailComponent implements OnInit {
  //#region "Property Decleration"
  form: FormGroup;
  contactInfoModel: PhysicianContactInfoModel = new PhysicianContactInfoModel();
   //#endregion
  //#region "Constructor"
  constructor(public fb: FormBuilder, private util: UtilService, public dialogRef: MatDialogRef<physicianContactDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder,) {
  }
  //#endregion
  //#region "ngOnInit"
  ngOnInit() {
    this.form = this._formBuilder.group({
      ProviderContactID: [''],
      ProviderID: [''],
      CellNumber: ['', Validators.required],
      PhoneNumber: ['', Validators.required],
      WhatsAppNumber: ['', Validators.required],
      EmergencyContactNumber: ['', Validators.required],
      TelephoneNo: [''],
      Fax: [''],
      Email: ['', Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")],
      samecellno:[''],
    });
    this.getdata();
  }
  //#endregion
  //#region "Get data"
  getdata() {
    this.form.get('CellNumber').setValue(this.data.CellNumber);
    this.form.get('PhoneNumber').setValue(this.data.PhoneNumber);
    this.form.get('WhatsAppNumber').setValue(this.data.WhatsAppNumber);
    this.form.get('EmergencyContactNumber').setValue(this.data.EmergencyContactNumber);
    this.form.get('TelephoneNo').setValue(this.data.TelephoneNo);
    this.form.get('Fax').setValue(this.data.Fax);
    this.form.get('Email').setValue(this.data.Email);
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
      this.contactInfoModel = new PhysicianContactInfoModel();
      this.contactInfoModel.CellNumber = this.form.get('CellNumber').value;
      this.contactInfoModel.PhoneNumber = this.form.get('PhoneNumber').value;
      this.contactInfoModel.WhatsAppNumber = this.form.get('WhatsAppNumber').value;
      this.contactInfoModel.EmergencyContactNumber = this.form.get('EmergencyContactNumber').value;
      this.contactInfoModel.TelephoneNo = this.form.get('TelephoneNo').value;
      this.contactInfoModel.Fax = this.form.get('Fax').value;
      this.contactInfoModel.Email = this.form.get('Email').value;
      this.util.showMessage('', 'Physician Contact details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => {
          this.dialogRef.close(this.contactInfoModel);
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
  //#region "Cell No"
  samecell() {
    if (this.form.get('samecellno').value) {
      this.form.get('WhatsAppNumber').setValue(this.form.get('CellNumber').value);
    } else {
      this.form.get('WhatsAppNumber').setValue("");
    }
  }
  //#endregion
}
