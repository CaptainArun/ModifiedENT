import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { StaffService } from '../staff.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../../core/util.service';
import { StaffcampusModel } from '../models/staffcampusModel'
import { CustomHttpService } from '../../core/custom-http.service';
@Component({
  selector: 'app-staffCampusComponent',
  templateUrl: './staff-campus.component.html',
  styleUrls: ['./staff-campus.component.css']
})

export class staffCampusComponent implements OnInit {

   //#region "Property Decleration"
  form: FormGroup;
  StaffcampusModel: StaffcampusModel = new StaffcampusModel();
  //#endregion
  //#region "constructor"
  constructor(private fb: FormBuilder, public dialog: MatDialog, private util: UtilService, private customHttpSvc: CustomHttpService, private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<staffCampusComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private staffservice: StaffService) {
  }
  //#endregion
  //#region "ng onInit"
  ngOnInit() {

    this.form = this.fb.group({
      Name: ['', Validators.required],
      Date: [''],
      Details: [''],
    })
    // this.staffaddform.controls['Addprofile'].get('Department').disable();
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getdata();
  }
  //#endregion
  //#region "Submit"
  submit() {
    if (this.form.valid) {
      this.StaffcampusModel.Name = this.form.get('Name').value
      this.StaffcampusModel.CampusDate = this.form.get('Date').value
      this.StaffcampusModel.Details = this.form.get('Details').value


      this.util.showMessage('', 'Staff Campus details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => {
          this.dialogRef.close(this.StaffcampusModel);
        }
      );

    }
  }
   //#endregion
  //#region "Get data"
  getdata() {
    this.form.get('Name').setValue(this.data.Name);
    this.form.get('Date').setValue(this.data.CampusDate);
    this.form.get('Details').setValue(this.data.Details);

  }
   //#endregion
  //#region "Clear"
  clear() {
    this.form.reset();
    this.getdata();
  }
   //#endregion
  //#region "Close"
  dialogClose(): void {
    this.dialogRef.close();
  }
   //#endregion
}
